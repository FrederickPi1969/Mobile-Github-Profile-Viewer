import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/home_screen';
import ProfileScreen from './src/profile_screen';
import RepoScreen from './src/repo_screen';
import FollowerScreen from './src/follower_screen';
import FollowingScreen from './src/following_screen';
import EmptyScreen from './src/empty_screen';
import LoadingScreen from './src/loading_screen';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();
const MainStackNavigator = function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ header: () => null }}
      >
        <Stack.Screen component={HomeScreen} name="Home" options={{ title: 'Home' }} />
        <Stack.Screen component={ProfileScreen} name="Profile" options={{ title: 'Profile' }} />
        <Stack.Screen component={RepoScreen} name="Repo" options={{ title: 'Repo' }} />
        <Stack.Screen component={FollowerScreen} name="Follower" options={{ title: 'Follower' }} />
        <Stack.Screen component={FollowingScreen} name="Following" options={{ title: 'Following' }} />
        <Stack.Screen component={EmptyScreen} name="Empty" options={{ title: 'Empty Results' }} />
        <Stack.Screen component={LoadingScreen} name="Loading" options={{ title: 'Loading' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <MainStackNavigator />
  );
}
