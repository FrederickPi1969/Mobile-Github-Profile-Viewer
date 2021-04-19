/* eslint-disable global-require */
import React from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
} from 'react-native';

/**
 * Empty Screen for cases where no results
 * (including search results, repos, followers, following) are available.
 * Prompt users correspondingly.
 */
class EmptyScreen extends React.Component {
  styles = StyleSheet.create({
    back: {
      color: '#2902eb',
      fontSize: 18,
    },
    img: {
      width: '60vw',
      height: '60vw',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '25%',
    },

    prompt: {
      marginTop: '2vh',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Comic Sans MS',
    },
  })

  constructor(props) {
    super(props);
    const { navigation, route } = this.props;
    this.navigation = navigation;
    this.prompt = route.params.emptyPrompt;
  }

  render() {
    return (
      <View style={{ backgroundColor: '#ffb8ce', height: '100vh' }}>
        <TouchableOpacity
          onPress={() => {
            this.navigation.goBack();
            if (this.prompt.startsWith('Sorry, this GitHub user')) {
              this.navigation.goBack();
            }
          }}
        >
          <Text style={this.styles.back}>
            {'< Back'}
          </Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/empty.png')}
          style={this.styles.img}
        />

        <Text style={this.styles.prompt}>
          {this.prompt}
        </Text>
      </View>
    );
  }
}

export default EmptyScreen;
/* eslint-disable global-require */
