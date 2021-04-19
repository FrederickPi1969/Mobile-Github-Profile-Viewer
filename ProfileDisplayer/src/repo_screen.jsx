/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet, Text, View,
  TouchableOpacity, ImageBackground,
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
  const output = (field === null || field === '') ? 'Not filled' : field;
  return output;
};

/**
 * Repo Screen for displaying all queried user's public repositories.
 */
class RepoScreen extends React.Component {
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

    repoWrapper: {
      width: '85%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '2%',
      borderRadius: 8,
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: '#d5ccff',
    },

    repoHeader: {
      fontWeight: 'bold',
      color: '#2a05e3',
      fontSize: 16,
    },

    repoDesc: {
      fontWeight: 'bold',
      color: '#626166',
      fontSize: 14,
    },

    repoOwner: {
      fontWeight: 'bold',
      color: '#ff8800',
      fontSize: 12,
    },
  })

  constructor(props) {
    super(props);
    const { navigation, route } = this.props;
    this.navigation = navigation;
    this.repo = route.params.repo;
    this.user = route.params.user;
  }

  /**
   * Navigate to the profile page of repo owner.
   * First fetch data and go to loading page,
   * redirect user to profile page when data is ready.
   * @param {string} ownerLogin the login of repo owner
   */
  async handleNav(ownerLogin) {
    const pushLoading = StackActions.push('Loading');
    this.navigation.dispatch(pushLoading);
    await fetchData(ownerLogin)
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
   * Iterate through all user's repo and create jsx element wrappers.
   */
  addAllRepoInfo() {
    const items = [];
    for (let i = 0; i < this.repo.length; i += 1) {
      const repo = this.repo[i].node;
      const ownerName = repo.owner.login;
      const repoName = repo.name;
      const repoDesc = repo.description;
      items.push(
        <View style={this.styles.repoWrapper} key={`Repo${i}`}>
          <View style={{ marginLeft: '1.5vw', marginTop: '0.5vh' }}>
            <Text style={this.styles.repoHeader}>
              {repoName}
            </Text>
            <Text style={this.styles.repoDesc}>{replaceNullField(repoDesc)}</Text>
            <TouchableOpacity
              style={this.styles.repoOwner}
              onPress={() => { this.handleNav(ownerName); }}
            >
              <Text style={this.styles.repoOwner}>
                {ownerName}
              </Text>

            </TouchableOpacity>
          </View>

        </View>,
      );
    }
    return items;
  }

  render() {
    if (this.repo === null || this.repo === undefined
        || this.repo.length === 0) {
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
          source={require('../assets/home_background.jpg')}
          style={{ minHeight: '100vh' }}
        >
          <TouchableOpacity
            onPress={() => this.navigation.goBack()}
          >
            <Text style={this.styles.back}>
              {'< Back'}
            </Text>
          </TouchableOpacity>

          <Text style={this.styles.header}>
            {`${this.user}'s Repos`}
          </Text>

          <View style={{ marginTop: '5%' }}>
            {this.addAllRepoInfo()}
          </View>
        </ImageBackground>
      </View>

    );
  }
}

export default RepoScreen;
/* eslint-disable global-require */
