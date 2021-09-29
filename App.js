/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import PushNotification from '@aws-amplify/pushnotification';
import { Analytics } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const setupNutifications = ({ }) => {

window.LOG_LEVEL='DEBUG'

  // get the registration token
  // This will only be triggered when the token is generated or updated.
  PushNotification.onRegister((token) => {
    // Alert('in app registration ' + token);
    console.log('in app registration ' + token);
    AsyncStorage.setItem('address', token)
    .then(p => console.log('Token saved successfully', p))
    .catch(e => console.log('Error Saving token', e));
    // Analytics.updateEndpoint({id: endpointId}).then(e => console.log('r', e)).catch(e => console.log('e', e))
  });

// }

const NotificationsProvider = ({ children }) => {

  useEffect(() => {
    setupNutifications({})
  }, [])
  return children
}

const Section = ({ children, title }): Node => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const [endpointId, setEndpointId] = useState(null);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setEndpointId(Analytics.getPluggable('AWSPinpoint')._config.endpointId);
      console.log('hola2', endpointId);
      if (endpointId) {
        AsyncStorage.getItem('address')
          .then(token => {
            const conf = {
              id: endpointId,
              Address: token,
              OptOut: 'NONE',
            };
            console.log('Token: ', token)
            Analytics.updateEndpoint(conf)
              .then(e => {
                console.log('Endpoint Updated:', e)

  // get the notification data when notification is received
  PushNotification.onNotification((notification) => {
    // Note that the notification object structure is different from Android and IOS
    console.log('in app notification ' + JSON.stringify(notification, null, 2));

    setNotif(JSON.stringify(notification, null, 2))
    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/push-notification-ios#finish)
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  });

  // get the notification data when notification is opened
  PushNotification.onNotificationOpened((notification) => {
    console.log('the notification is opened ' + JSON.stringify(notification, null, 2));
  });
              })
              .catch(e => console.log('Error Updating Endpoint', e))
          })
          .catch(e => console.log('No Token: ', e))
      }
    }, 1000);
  }, [endpointId]);
  
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* <NotificationsProvider> */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Text style={styles.highlight}>{endpointId}</Text>
          <Text style={styles.highlight}>{notif}</Text>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      {/* </NotificationsProvider> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
