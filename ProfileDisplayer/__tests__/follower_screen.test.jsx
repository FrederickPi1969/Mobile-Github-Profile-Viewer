import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import FollowerScreen from '../src/follower_screen';
import { fetchData } from '../src/model';

const fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

it('renders correctly - good condition', async () => {
  await fetchData('BillyZhaohengLi')
    .then((userData) => ({
      params: {
        followers: userData.followers.edges,
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const tree = renderer.create(<FollowerScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - user has 0 followers', async () => fetchData('FrederickPi1969')
  // Real bad condition - user has no public followers
  .then((userData) => ({
    params: {
      followers: userData.followers.edges,
      user: userData.followers.userLogin,
    },
  }))
  .then((params) => {
    const tree = renderer.create(<FollowerScreen
      navigation={null}
      route={params}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  }));

it('renders correctly - mocked network error', async () => {
  await fetchData('FrederickPi1969', fetch) // using mocked fetch!
  // Mocked bad condition - network error
    .then((userData) => {
      if (userData !== null) {
        throw new Error('Error!');
      }
      return {
        params: {
          followers: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<FollowerScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - mocked other errors', async () => {
  // Mocked bad condition - unexpected errors, such as
  // follower query result is missing, or authorization error
  fetch.mockResponseOnce(JSON.stringify({ data: { error: 'unexpected error.' } }));
  await fetchData('BillyZhaohengLi', fetch) // using mocked fetch!
    .then((userData) => {
      if (userData !== null) {
        throw new Error('Error!');
      }
      return {
        params: {
          followers: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<FollowerScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('Navigation Test for followers', async () => {
  // confirming that navigation function will
  // be invoked as many times as the user's followers.
  const navMock = jest.fn();
  const navigation = { navigate: navMock };
  await fetchData('yeying19')
    .then((userData) => ({
      params: {
        followers: userData.followers.edges,
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const { getByTestId } = render(
        <FollowerScreen navigation={navigation} route={params} />,
      );

      for (let i = 0; i < params.params.followers.length; i += 1) {
        const follower = params.params.followers[i].node;
        const followerLogin = follower.login;
        fireEvent.press(getByTestId(followerLogin));
      }
      expect(navMock.mock.calls.length).toBe(params.params.followers.length);
    });
});
