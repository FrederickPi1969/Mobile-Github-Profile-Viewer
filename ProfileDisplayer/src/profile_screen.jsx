/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet, Image, Text, View,
  TouchableOpacity, ImageBackground,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
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
  const output = (field === null || field === '') ? 'Not filled' : field;
  return output;
};

/**
 * This is major screen of the program,
 * demonstrating all profile information of a target github user.
 * This screen also includes navigation to
 * {Follower, Following, Repo} screen in the touchable opacities.
 */
class ProfileScreen extends React.Component {
  styles = StyleSheet.create({
    back: {
      color: '#2902eb',
      fontSize: 18,
    },

    avatar: {
      width: 120,
      height: 120,
      borderRadius: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '10%',
    },

    horizontalAlign: {
      marginTop: '10%',
      flexDirection: 'row',
    },

    horizontalElem: {
      textAlign: 'center',
      width: '33.3vw',
      height: '20vw',
      fontWeight: '300',
      fontSize: 18,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#e8ebe4',
      marginTop: 'auto',
      marginBottom: 'auto',
    },

    upperFont: {
      fontWeight: 'bold',
      fontSize: 16,
    },

    attr: {
      fontWeight: '500',
      fontSize: 16,
      marginTop: '1vh',
    },

    attrVal: {
      fontWeight: '400',
      fontSize: 16,
      marginTop: '1vh',
    },
  })

  constructor(props) {
    super(props);
    const { navigation, route } = this.props;
    this.navigation = navigation;
    this.userData = route.params.userData;
  }

  /**
   * Demonstrate followers on Follower Screen if there exists followers,
   * navigate to Empty Screen otherwise.
   */
  handleFollowersNav() {
    if (this.userData.followers.edges === null
        || this.userData.followers.edges === undefined
        || this.userData.followers.edges.length === 0) {
      const emptyPrompt = `${this.userData.userLogin} has no followers.`;
      const pushEmpty = StackActions.push('Empty', { emptyPrompt });
      this.navigation.dispatch(pushEmpty);
    } else {
      const pushFollower = StackActions.push('Follower',
        { followers: this.userData.followers.edges, user: this.userData.userLogin });
      this.navigation.dispatch(pushFollower);
    }
  }

  /**
   * Demonstrate other git members queried user is following
   * on Following Screen if there exists any,
   * navigate to Empty Screen otherwise.
   */
  handleFollowingNav() {
    if (this.userData.following.edges === null
        || this.userData.following.edges === undefined
        || this.userData.following.edges.length === 0) {
      const emptyPrompt = `${this.userData.userLogin} is not following other GitHub users.`;
      const pushEmpty = StackActions.push('Empty', { emptyPrompt });
      this.navigation.dispatch(pushEmpty);
    } else {
      const pushFollowing = StackActions.push('Following',
        { following: this.userData.following.edges, user: this.userData.userLogin });
      this.navigation.dispatch(pushFollowing);
    }
  }

  /**
   * Demonstrate user's repo on Repo Screen if there exists repo,
   * navigate to Empty Screen otherwise.
   */
  handleRepoNav() {
    if (this.userData.repo.edges === null
        || this.userData.repo.edges === undefined
        || this.userData.repo.edges.length === 0) {
      const emptyPrompt = `${this.userData.userLogin} has no public repositories.`;
      const pushEmpty = StackActions.push('Empty', { emptyPrompt });
      this.navigation.dispatch(pushEmpty);
    } else {
      const pushRepo = StackActions.push('Repo',
        { repo: this.userData.repo.edges, user: this.userData.userLogin });
      this.navigation.dispatch(pushRepo);
    }
  }

  render() {
    if (this.userData === null) {
      // This is only for testing and should never be reached otherwise
      // Checking is done on home screen so userData
      // should never be null in practice.
      return (
        <EmptyScreen
          navigation={null}
          route={{ params: { emptyPrompt: 'Empty!' } }}
        />
      );
    }

    return (
      <View>
        <View>
          <ImageBackground
            style={{ minWidth: '100vw' }}
            source={require('../assets/top_background.jpg')}
          >
            <TouchableOpacity
              onPress={() => {
                const pushAction = StackActions.pop(2);
                this.navigation.dispatch(pushAction);
              }}
            >
              <Text style={this.styles.back}>
                {'< Back'}
              </Text>
            </TouchableOpacity>

            <View>
              <Image
                source={{ uri: this.userData.avatar }}
                style={this.styles.avatar}
              />
              <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>
                {this.userData.userLogin}
              </Text>
            </View>

            <View style={this.styles.horizontalAlign}>
              <TouchableOpacity
                style={this.styles.horizontalElem}
                onPress={() => this.handleFollowersNav()}
              >
                <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <Text style={this.styles.upperFont}>Followers</Text>
                  <Text style={this.styles.upperFont}>{this.userData.followers.edges.length}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={this.styles.horizontalElem}
                onPress={() => this.handleFollowingNav()}
              >
                <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <Text style={this.styles.upperFont}>Following</Text>
                  <Text style={this.styles.upperFont}>{this.userData.following.edges.length}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={this.styles.horizontalElem}
                onPress={() => this.handleRepoNav()}
              >
                <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <Text style={this.styles.upperFont}>Repo</Text>
                  <Text style={this.styles.upperFont}>{this.userData.repo.edges.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View>
          <ImageBackground
            source={require('../assets/bottom_background.jpg')}
            style={{ minHeight: '75vh', minWidth: '100vw' }}
          >
            <View style={{ marginLeft: '3vw', marginTop: '4vh' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>User Info</Text>
              <View style={{ marginTop: '1.5vh' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Name:  </Text>
                  <Text style={this.styles.attrVal}>
                    {replaceNullField(this.userData.userName)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Email:  </Text>
                  <Text style={this.styles.attrVal}>
                    {replaceNullField(this.userData.email)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Website:  </Text>
                  <Text style={this.styles.attrVal}>
                    {replaceNullField(this.userData.website)}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Bio:  </Text>
                  <Text style={this.styles.attrVal}>
                    {replaceNullField(this.userData.bio)}
                  </Text>
                </View>

              </View>
            </View>

            <View style={{ marginLeft: '3vw', marginTop: '3vh' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {'About'}
                {' '}
              </Text>
              <View style={{ marginTop: '1.5vh' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Git:  </Text>
                  <Text style={this.styles.attrVal}>{`https://github.com/${this.userData.userLogin}`}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Creation Date:  </Text>
                  <Text style={this.styles.attrVal}>{this.userData.createdAt.slice(0, 10)}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={this.styles.attr}>Last Update:  </Text>
                  <Text style={this.styles.attrVal}>{this.userData.updatedAt.slice(0, 10)}</Text>
                  <Text>{'\n\n\n'}</Text>
                </View>
              </View>
            </View>

          </ImageBackground>
        </View>

      </View>
    );
  }
}
export default ProfileScreen;
/* eslint-disable global-require */
