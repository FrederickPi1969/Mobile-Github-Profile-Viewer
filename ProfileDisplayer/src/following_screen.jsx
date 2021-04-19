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
 * Following Screen for showing all github users
 * that current queried user is following.
 */

class FollowingScreen extends React.Component {
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

    followingWrapper: {
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

    followingLogin: {
      fontWeight: 'bold',
      fontSize: 20,
      fontFamily: "'Comic Sans MS'",
      color: '#2a05e3',
    },

    followingName: {
      fontSize: 16,
      fontWeight: '400',
      color: '#ff8800',
    },
  })

  constructor(props) {
    super(props);
    const { navigation, route } = this.props;
    this.navigation = navigation;
    this.followings = route.params.following;
    this.user = route.params.user;
  }

  /**
   * When user clicked on one following,
   * navigate to loading page first &
   * send post request to graphql,
   * and redirect user to the following profile page
   * when data get ready.
   * @param {string} followingLogin the login of following being clicked
   */
  async handleNav(followingLogin) {
    const pushLoading = StackActions.push('Loading');
    this.navigation.dispatch(pushLoading);
    await fetchData(followingLogin)
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
   * the users that the current queried user is following to screen.
   * @returns a list of react-native components to be directly rendered.
   */
  addAllFollowings() {
    const items = [];
    for (let i = 0; i < this.followings.length; i += 1) {
      const following = this.followings[i].node;
      const followingAvatarURL = following.avatarUrl;
      const followingLogin = following.login;
      const followingName = following.name;
      items.push(
        <TouchableOpacity
          style={this.styles.followingWrapper}
          key={`Following${i}`}
          testID={followingLogin}
          onPress={() => { this.handleNav(followingLogin); }}
        >
          <View style={{ marginLeft: '1.5vw', marginTop: '0.5vh', flexDirection: 'row' }}>
            <Image
              source={{ uri: followingAvatarURL }}
              style={this.styles.avatar}
            />
            <View style={{ marginLeft: '6.5vw', marginTop: '1vh' }}>
              <Text style={this.styles.followingLogin}>{followingLogin}</Text>
              <Text style={this.styles.followingName}>{replaceNullField(followingName)}</Text>
            </View>
          </View>

        </TouchableOpacity>,
      );
    }
    return items;
  }

  render() {
    if (this.followings === null || this.followings === undefined
        || this.followings.length === 0) {
      // this is only for testing and should never be reached otherwise
      // This checking is done on profile screen when handling navigation,
      // and this condition will never be true in practice usage.
      return (
        <EmptyScreen
          navigation={null}
          route={{ params: { emptyPrompt: 'Empty!' } }}
        />
      );
    }

    return (
      <View>
        <ImageBackground
          style={{ minHeight: '100vh' }}
          source={require('../assets/home_background.jpg')}
        >
          <TouchableOpacity onPress={() => this.navigation.goBack()}>
            <Text style={this.styles.back}>
              {'< Back'}
            </Text>
          </TouchableOpacity>

          <Text style={this.styles.header}>
            {`${this.user}'s Followings`}
          </Text>

          <View style={{ marginTop: '5%' }}>
            {this.addAllFollowings()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default FollowingScreen;
/* eslint-disable global-require */
