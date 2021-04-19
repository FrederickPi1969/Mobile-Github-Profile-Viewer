import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
import FollowingScreen from '../src/following_screen';
import { fetchData } from '../src/model';

const fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

it('renders correctly - good condition', async () => {
  await fetchData('BillyZhaohengLi')
    .then((userData) => ({
      params: {
        following: userData.following.edges,
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const tree = renderer.create(<FollowingScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - user has 0 followings', async () => {
  await fetchData('FrederickPi1969')
  // Real bad condition - user has no public followings.
    .then((userData) => ({
      params: {
        following: [],
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const tree = renderer.create(<FollowingScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - mocked network error', async () => {
  await fetchData('FrederickPi1969', fetch) // using mocked fetch!
  // Mocked bad condition - network error
    .then((userData) => {
      if (userData !== null) {
        throw new Error('Error!');
      }
      return {
        params: {
          following: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<FollowingScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - mocked other errors', async () => {
  // Mocked bad condition - unexpected errors, such as
  // following result is missing in response, or authorization error
  await fetch.mockResponseOnce(JSON.stringify({ data: { error: 'unexpected error.' } }));
  fetchData('FrederickPi1969', fetch) // using mocked fetch!
    .then((userData) => {
      if (userData !== null) {
        throw new Error('Error!');
      }
      return {
        params: {
          following: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<FollowingScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('Navigation Test for followings', async () => {
  // confirming that navigation function will
  // be invoked as many times as the user's followings.
  const navMock = jest.fn();
  const navigation = { navigate: navMock };
  await fetchData('yeying19')
    .then((userData) => ({
      params: {
        followings: userData.following.edges,
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const { getByTestId } = render(
        <FollowingScreen navigation={navigation} route={params} />,
      );

      for (let i = 0; i < params.params.followings.length; i += 1) {
        const following = params.params.followings[i].node;
        const followingLogin = following.login;
        fireEvent.press(getByTestId(followingLogin));
      }
      expect(navMock.mock.calls.length).toBe(params.params.followings.length);
    });
});
