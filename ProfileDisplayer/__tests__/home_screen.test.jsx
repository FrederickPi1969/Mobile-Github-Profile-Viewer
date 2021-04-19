import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import HomeScreen from '../src/home_screen';

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  const tree = renderer.create(<HomeScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
