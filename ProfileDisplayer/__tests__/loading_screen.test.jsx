import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LoadingScreen from '../src/loading_screen';

/**
 * Test the rendering of loading screen.
 * Notice all of the screens that involve fetching
  * (Home, Profile, Repo, Follower, Following)
  * will invoke this loading screen so that we
  * don't need to test repetitively.
  */
it('renders correctly', () => {
  const tree = renderer.create(<LoadingScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
