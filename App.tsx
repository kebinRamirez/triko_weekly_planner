import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeNavigator from './src/Navigators/HomeNavigator';

export default function App() {

  return (
    <NavigationContainer>
      <HomeNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});
