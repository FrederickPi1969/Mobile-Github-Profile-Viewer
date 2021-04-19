import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import EmptyScreen from '../src/empty_screen';

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  const tree = renderer.create(<EmptyScreen
    navigation={null}
    route={{ params: { emptyPrompt: 'Empty!' } }}
  />).toJSON();
  expect(tree).toMatchSnapshot();
});
