import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BookMarkScreen from '../../components/story/book-mark';
import HistoryScreen from '../../components/story/history';

const Tab = createMaterialTopTabNavigator();

const IndexScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Lịch Sử" component={HistoryScreen} />
      <Tab.Screen name="Đánh dấu" component={BookMarkScreen} />
    </Tab.Navigator>
  );
};

export default IndexScreen;