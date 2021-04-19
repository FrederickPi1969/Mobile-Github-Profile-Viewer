import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * When user data are being fetched from graphQL,
 * This Loading Screen will be on the app screen
 * until the data is ready.
 * Notice all of the screens that involve fetching
 * (Home, Profile, Repo, Follower, Following)
 * will invoke this loading screen.
 */
class LoadingScreen extends React.Component {
  styles = StyleSheet.create({
    prompt: {
      marginTop: '35vh',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  })

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.navigation = navigation;
  }

  render() {
    return (
      <View>
        <Text style={this.styles.prompt}>Loading...</Text>
      </View>
    );
  }
}

export default LoadingScreen;
