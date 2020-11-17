import React from 'react';
import {
  ApplicationProvider,
  Input,
  Button,
  Layout,Datepicker,Icon,Toggle
} from '@ui-kitten/components';
import {StyleSheet, View, Text, Image} from 'react-native';
import * as eva from '@eva-design/eva';
import moment from 'moment';
import axios from 'axios';
import {BASE_URL} from '../helper/utilities';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';


class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      users:[]
    }
  }

 async componentDidMount(){
    //console.log('ERR: ===>>>', this.props.route.params)
   await  this.fetchAllUser()
    
  }

  fetchAllUser(){
    axios.get(`${BASE_URL}user/fetchAllUser`)
    .then(response =>{
      if(response){
        this.setState({users: response.data.users})
      }
    })
    .catch(err =>{
      console.log('ERR: ', err)
    })
  }

   onCheckedChange =(id, status)=>{
     console.log('===id==' + id +' status: '+ status)
     if(status === false){
        axios.post(`${BASE_URL}user/upgrade`,{
          user: id,
          status:'upgrade'
        })
        .then(response =>{
          if(response){
           this.fetchAllUser()
           Toast.show('User Status Changed', Toast.SHORT);

          }
        })
        .catch(err =>{
          console.log('ERR: ', err)
        })
     }else{
        axios.post(`${BASE_URL}user/upgrade`,{
          user: id,
          status:'downgrade'
        })
        .then(response =>{
          if(response){
            this.fetchAllUser()
            Toast.show('User Status Changed', Toast.SHORT);
          }
        })
        .catch(err =>{
          console.log('ERR: ', err)
        })
     }
    
  }

  render() {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.layout}>
          {
            this.state.users && this.state.users.map((item, index) =>{
              return(
                <View style={styles.nameHolder}>
                   <Text style={styles.name}>{item.name}</Text>
                   <Toggle checked={item.is_admin} onChange={this.onCheckedChange.bind(this, item._id, item.is_admin)}/>
                </View>
              )
            })
          }
         
        
          
        </Layout>
      </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#80BCFF',
  },
  input: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  row: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  btn: {
    alignItems: 'flex-end',
  },
  errorMsg:{
    paddingBottom:10,
    color:'red',
    fontSize:16
  },
  avatar:{
    width:100,
    height:100,
    margin:10
  },
  title:{
    textAlign:"left",
    width:'100%',
    paddingLeft:10,
    paddingTop:5,
    paddingBottom:5
  },
  nameHolder:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
    backgroundColor:'white',
    marginBottom:10
  },
  name:{
    fontWeight:'bold',
    padding:10
  }
});

export default UsersList;
