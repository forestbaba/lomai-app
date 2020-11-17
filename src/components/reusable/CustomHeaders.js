import React,{useEffect, useState} from 'react'
import {Button, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { EventRegister } from 'react-native-event-listeners'


const HomeHeader =(props)=> {
    const [user, setUser] = useState({})

    useEffect(()=>{
        EventRegister.on('loggedIn',(data)=>{
            let newUser = JSON.parse(data)
          console.log('============', newUser)
           setUser(newUser.user)
        })
    },[])
   return( 
   <View style={styles.parent}>
       <Image
         style={styles.image}
         source={require('../../assets/csslogo.png')}
         
        />
        <Text style={styles.title}>Home</Text>
        {
            user.is_admin === true ? (<TouchableOpacity onPress={props.clickCreate}><Text>Create</Text></TouchableOpacity>) : null
        }
        
        
  </View>
);
}

const styles = StyleSheet.create({
    parent:{
        flex:1,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    title:{
        fontWeight:'bold'
    }
})
export {HomeHeader}