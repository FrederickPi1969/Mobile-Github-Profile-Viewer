/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, Image, ImageBackground,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { fetchData } from './model';

/**
 * Home Page of the app. Enable the users to query
 * github users per github login.
 */
class HomeScreen extends React.Component {
    styles = StyleSheet.create({
      logo: {
        width: '33vw',
        height: '33vw',
        borderRadius: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '25%',

      },
      header: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '15%',
        fontSize: 20,
      },
      inputBox: {
        fontSize: 18,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'black',
        color: '#ebebeb',
        borderRadius: 5,
        marginTop: '8%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
        height: '5.5vh',
      },
      submit: {
        color: 'green',
        backgroundColor: '#4a4a4a',
        marginTop: '10%',
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: 'black',
        // border: '0.5px solid black',
        borderRadius: 8,
        width: '25%',
        height: '5.5vh',
        marginLeft: '37.5%',
        textAlign: 'center',
      },
    });

    constructor(props) {
      super(props);
      this.state = { targetUser: 'BillyZhaohengLi' };
    }

    /**
     * Fetch target user via graphQL API of github.
     * Then first navigate to Loading Screen.
     * After fetching is ready, navigate to Profile Screen.
     */
    getTargetUser() {
      const { navigation } = this.props;
      const { targetUser } = this.state;
      const pushLoading = StackActions.push('Loading');
      navigation.dispatch(pushLoading);
      fetchData(targetUser)
        .then((userData) => {
          if (userData === null) {
            // error - non existing user
            const emptyPrompt = 'Sorry, this GitHub user does not exist, or'
                                    + ' your authorization token is wrong.';
            const pushEmpty = StackActions.push('Empty', { emptyPrompt });
            navigation.dispatch(pushEmpty);
          } else {
            const pushProfile = StackActions.push('Profile', { userData });
            navigation.dispatch(pushProfile);
          }
        });
    }

    render() {
      const { targetUser } = this.state;
      return (
        <ImageBackground
          source={require('../assets/home_background.jpg')}
          style={{ minHeight: '100vh' }}
        >
          <View>
            <Image
              source={require('../assets/git_logo.jpg')}
              style={this.styles.logo}
            />
            <Text style={this.styles.header}>Which GitHub User Are you Looking for?</Text>
            <TextInput
              style={this.styles.inputBox}
              onChangeText={(text) => this.setState({ targetUser: text })}
              defaultValue={targetUser}
            />

            <TouchableOpacity
              onPress={() => this.getTargetUser()}
              style={this.styles.submit}
            >
              <Text style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#ebebeb',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

      );
    }
}

export default HomeScreen;
/* eslint-disable global-require */
