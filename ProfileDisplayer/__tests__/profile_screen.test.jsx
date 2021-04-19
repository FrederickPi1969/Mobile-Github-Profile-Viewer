import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ProfileScreen from '../src/profile_screen';
import { fetchData } from '../src/model';

const fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

it('renders correctly - good condition', async () => {
  await fetchData('FrederickPi1969').then((user) => {
    const tree = renderer.create(<ProfileScreen
      navigation={null}
      route={{ params: { userData: user } }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('renders correctly - non existing user', async () => {
  // Real bad condition - response is error due to non-existing user
  await fetchData('FrederickPi1969aaaaa').then((user) => {
    const tree = renderer.create(<ProfileScreen
      navigation={null}
      route={{ params: { userData: user } }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('renders correctly - mocked network error', async () => {
  // Mocked bad condition - network error
  await fetchData('FrederickPi1969', fetch).then((user) => {
    const tree = renderer.create(<ProfileScreen
      navigation={null}
      route={{ params: { userData: user } }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('renders correctly - mocked other errors', async () => {
  // Mocked bad condition - other errors such as authorization failure.
  await fetch.mockResponseOnce(JSON.stringify({ data: { error: 'unexpected error.' } }));
  return fetchData('FrederickPi1969', fetch).then((user) => {
    const tree = renderer.create(<ProfileScreen
      navigation={null}
      route={{ params: { userData: user } }}
    />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
