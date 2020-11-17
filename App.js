import React from 'react';
import Login from './src/components/login';
import Welcome from './src/components/welcome';
import SignUp from './src/components/signup';
import SignUpStep from './src/components/signupstep';
import LoginInfo from './src/components/logininfo';
import Home from './src/components/home';
import Contact from './src/components/contact';
import AddInterst from './src/components/Addinterest';
import UsersList from './src/components/UsersList';
import ProfileDetail from './src/components/tabbar/profileDetail';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'; 
import {Button,Image} from 'react-native'
import {HomeHeader} from './src/components/reusable/CustomHeaders'
import { EventRegister } from 'react-native-event-listeners'


const Stack = createStackNavigator();



class App extends React.Component {

  componentDidMount(){
    setTimeout(() => {
          console.log('+++++++++++++COME IN', this.props)
    }, 5000);
  }

   LogoTitle() {
    return (
      <Image
        style={{ width: 50, height: 50 }}
        source={require('./src/assets/user.png')}
      />
    );
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="welcome">
          <Stack.Screen
            name="welcome"
            component={Welcome}
            navigation={this.props.navigation}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen
            name="login"
            component={Login}
            navigation={this.props.navigation}
            options={{title: 'Login'}}
          />
          <Stack.Screen
            name="signup"
            component={SignUp}
            options={{title: 'Sign up'}}
          />
          <Stack.Screen
            name="logininfo"
            component={LoginInfo}
            options={{title: 'Login info'}}
          />
          <Stack.Screen
            name="signupstep"
            component={SignUpStep}
            options={{title: 'Sign up'}}
          />
          <Stack.Screen
            name="userslist"
            component={UsersList}
            options={{title: 'Users'}}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={({ navigation, route }) => ({
              headerTitle: props => <HomeHeader 
              {...props} 
              clickCreate={() => navigation.navigate('addinterest')} />
            })}

          
            // options={{ headerTitle: props => <this.LogoTitle {...props} /> }}

            // options={{title: 'Home'}}
          />
          <Stack.Screen
            name="contact"
            component={Contact}
            options={{title: 'Contact'}}
          />
          <Stack.Screen
            name="addinterest"
            component={AddInterst}
            options={{title: 'Add interest'}}
          />
          <Stack.Screen
            name="profileDetail"
            component={ProfileDetail}
            options={{title: 'Profile Detail'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
