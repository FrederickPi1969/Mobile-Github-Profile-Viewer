import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import RepoScreen from '../src/repo_screen';
import { fetchData } from '../src/model';

const fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

it('renders correctly - good condition', async () => {
  await fetchData('FrederickPi1969')
    .then((userData) => ({
      params: {
        repo: userData.repo.edges,
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const tree = renderer.create(<RepoScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - user has 0 repos', async () => {
  await fetchData('FrederickPi1969')
    // Real bad condition - user has no public repos.
    .then((userData) => ({
      params: {
        repo: [],
        user: userData.userLogin,
      },
    }))
    .then((params) => {
      const tree = renderer.create(<RepoScreen
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
          repo: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<RepoScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});

it('renders correctly - mocked other errors', async () => {
  // Mocked bad condition - unexpected errors, such as
  // repo page permanently removed, or authorization error
  fetch.mockResponseOnce(JSON.stringify({ data: { error: 'unexpected error.' } }));
  await fetchData('FrederickPi1969', fetch) // using mocked fetch!
    .then((userData) => {
      if (userData !== null) {
        throw new Error('Error!');
      }
      return {
        params: {
          repo: null,
          user: null,
        },
      };
    })
    .then((params) => {
      const tree = renderer.create(<RepoScreen
        navigation={null}
        route={params}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});
