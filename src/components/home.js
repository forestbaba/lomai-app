import React from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import news from './tabbar/news';
import directory from './tabbar/directory';
import homeTabbar from './tabbar/home';
import profile from './tabbar/profile';
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios';
import {BASE_URL} from '../helper/utilities';
import { EventRegister } from 'react-native-event-listeners'

MaterialCommunityIcons.loadFont()

const Tab = createMaterialBottomTabNavigator();

class Home extends React.Component {

  async componentDidMount(){
  let userdata =  await AsyncStorage.getItem('user_details')
  console.log('>>>>>>>>>>>>>>>>',JSON.parse(userdata))

  // this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
  //   userdata:userdata
  //   // this.setState({
  //   //     data,
  //   // })
  // })
  EventRegister.emit("loggedIn", userdata)
  

  }
  render() {

    return (
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#FFFFFF"
        inactiveColor="#FFFFFF"
        barStyle={{backgroundColor: '#000000'}}>
        <Tab.Screen
          name="Home"
          component={homeTabbar}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={news}
          options={{
            tabBarLabel: 'News',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="newspaper-variant"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Directory"
          component={directory}
          options={{
            tabBarLabel: 'Directory',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="application"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default Home;
