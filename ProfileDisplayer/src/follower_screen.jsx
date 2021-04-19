/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ImageBackground, Image,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { fetchData } from './model';
import EmptyScreen from './empty_screen';

/**
 * Check whether the data of a certain field
 * responded by github graphql is null.
 * If yes, replace them with "not filled"
 * for displaying concern.
 * @param {String} field a field of userData to be checked with
 * @returns the field value if not null, "not filled" otherwise.
 */
const replaceNullField = function replaceNullField(field) {
  const output = (field === null || field === '') ? '' : field;
  return output;
};

/**
 * Follower Screen for demonstrating the all followers
 * the queried user.
 */
class FollowerScreen extends React.Component {
  styles = StyleSheet.create({
    back: {
      color: '#2902eb',
      fontSize: 18,
    },

    header: {
      marginTop: '5%',
      marginLeft: '3%',
      fontSize: 20,
      fontWeight: 'bold',
    },

    followerWrapper: {
      width: '85%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '2.5vh',
      borderRadius: 8,
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: '#e6e4e3',
      paddingBottom: '0.5vh',
    },

    avatar: {
      borderRadius: 500,
      width: '9vh',
      height: '9vh',
    },

    followerLogin: {
      fontWeight: 'bold',
      fontSize: 20,
      fontFamily: "'Comic Sans MS'",
      color: '#2a05e3',
    },

    followerName: {
      fontSize: 16,
      fontWeight: '400',
      color: '#ff8800',
    },
  })

  constructor(props) {
    super(props);
    const { navigation, route } = this.props;
    this.navigation = navigation;
    this.followers = route.params.followers;
    this.user = route.params.user;
  }

  /**
   * When user clicked on follower,
   * navigate to loading page first &
   * send post request to graphql,
   * and redirect user to the follower profile page
   * when data get ready.
   * @param {string} followerLogin the login of follower being clicked
   */
  async handleNav(followerLogin) {
    const pushLoading = StackActions.push('Loading');
    this.navigation.dispatch(pushLoading);
    // this.navigation.navigate('Loading');
    await fetchData(followerLogin)
      .then((userData) => {
        if (userData === null) {
        // error - non existing user
          const emptyPrompt = 'Sorry, this GitHub user no long exists';
          const pushEmpty = StackActions.push('Empty', { emptyPrompt });
          this.navigation.dispatch(pushEmpty);
        } else {
          const pushProfile = StackActions.push('Profile', { userData });
          this.navigation.dispatch(pushProfile);
        }
      });
  }

  /**
   * Add all components (viewer wrappers) containing
   * the users are following the current queried user to screen.
   * @returns a list of react-native components to be directly rendered.
   */
  addAllFollowers() {
    const items = [];
    for (let i = 0; i < this.followers.length; i += 1) {
      const follower = this.followers[i].node;
      const followerAvatarURL = follower.avatarUrl;
      const followerLogin = follower.login;
      const followerName = follower.name;
      items.push(
        <TouchableOpacity
          style={this.styles.followerWrapper}
          key={`Follower${i}`}
          testID={followerLogin}
          onPress={() => { this.handleNav(followerLogin); }}
        >
          <View
            style={{ marginLeft: '1.5vw', marginTop: '0.5vh', flexDirection: 'row' }}
            testID={`FollowerImgWrapper${i}`}
          >
            <Image
              testID={`FollowerAvatar${i}`}
              source={{ uri: followerAvatarURL }}
              style={this.styles.avatar}
            />
            <View
              testID={`FollowerTextWrapper${i}`}
              style={{ marginLeft: '6.5vw', marginTop: '1vh' }}
            >
              <Text testID={`FollowerLogin${i}`} style={this.styles.followerLogin}>
                {followerLogin}
              </Text>
              <Text testID={`FollowerName${i}`} style={this.styles.followerName}>
                {replaceNullField(followerName)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>,
      );
    }
    return items;
  }

  render() {
    if (this.followers === null || this.followers === undefined
        || this.followers.length === 0) {
      // this is only for testing and should never be reached otherwise
      // This checking is done on profile screen when handling navigation,
      // and this condition will never be true in practice usage.
      return (
        <EmptyScreen
          testID="Empty"
          navigation={null}
          route={{ params: { emptyPrompt: 'Empty!' } }}
        />
      );
    }

    return (
      <View>
        <ImageBackground
          testID="background"
          style={{ minHeight: '100vh' }}
          source={require('../assets/home_background.jpg')}
        >
          <TouchableOpacity
            testID="back"
            onPress={() => this.navigation.goBack()}
          >
            <Text style={this.styles.back} testID="backString">
              {'< Back'}
            </Text>
          </TouchableOpacity>

          <Text style={this.styles.header} testID="header">
            {`${this.user}'s Followers`}
          </Text>

          <View style={{ marginTop: '5%' }} testID="Wrapper">
            {this.addAllFollowers()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default FollowerScreen;
/* eslint-disable global-require */
