import React,{useEffect, useState} from 'react';
import {ApplicationProvider} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView, Image, Alert} from 'react-native';
import * as eva from '@eva-design/eva';
import {Input, Layout, Button, Avatar, Card, Text} from '@ui-kitten/components';
import SearchBar from 'react-native-search-bar';
import {BASE_URL} from '../../helper/utilities';
import axios from 'axios';
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import newimage from '../../assets/primary-logo.png'
//'../../assets/primary-logo.png'

let baseImage = "http://localhost:13000/primary-logo.png"

export const Directory = ({navigation}) => {

  const [allPosts, setAllposts] = useState([])
  const [succ, setSucc] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [activeUser, setActiveUser]= useState({})

  useEffect(async () => {

    loadAllPost();
    
    let userDetails = await AsyncStorage.getItem('user_details')
    console.log('?/////', userDetails)

    setActiveUser(JSON.parse(userDetails))

  },[])

  const loadAllPost=()=>{
    axios.get(`${BASE_URL}post/fetchAll`)
    .then(response =>{
      let posts= response.data.posts
      setAllposts(posts)
    })
    .catch(err =>{
      console.log('ERR: ', err)
    })
  }
  const handleFollow=async (id)=>{
    let userDetails = await AsyncStorage.getItem('user_details')
    let newUser = JSON.parse(userDetails)
  
    axios.post(`${BASE_URL}post/subscribe`,{postId:id, user:newUser.user.id })
    .then(response =>{
      if(response){
        console.log('RES: ', response.data)
        setSucc(response.data.message) 
      }
    })
    .catch(err =>{
      console.log('ERR: ', err.response.data)
      setErrMsg(err)
    })
  }

  const handleEdit = async(id, user,post)=>{
    console.log('Full user object: ', activeUser.user.id)
    console.log('USER: ' + user + " Event: "+id)
    navigation.navigate('addinterest',{
      post:post
    })
  }
  const handleDelete = async(user,post)=>{

    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post ?",
      [
        
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          axios.post(`${BASE_URL}post/delete`,{
            postId:post,
            user:user
          })
          .then(response =>{
            if(response.data.error === false){
              loadAllPost()
              alert('Post deleted')
            }else{
              alert('Something went wrong')
            }
          })
        } }
      ],
      { cancelable: false }
    );
   

    
  }
  const Header = (props) => (
    <View {...props}>
      <Text category="h6">{props.title}</Text>
      <Text category="s1">Click to move club detail</Text>
    </View>
  );
  
  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      {
        activeUser.user.id === props.user ? (
        <View style={styles.actionHolders}>
          <Button style={styles.footerControl} 
          onPress={()=>handleEdit(props.id,props.user, props.post)}
          size="small" status="success">
            Edit
          </Button>
          <Button style={styles.footerControl} 
          onPress={()=>handleDelete(props.user, props.id)}
          size="small" status="danger">
            Delete
          </Button>
          </View>) : null
      }
    
      
      <Button style={styles.footerControl} 
      onPress={()=>handleFollow(props.id)}
      size="small" status="success">
        FOLLOW
      </Button>
    </View>
  );
  
  return(
  <ApplicationProvider {...eva} theme={eva.light}>
    <Layout style={styles.layout} level="1">
      <React.Fragment>
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          status="info"
          placeholder="Search"
          style={{
            borderColor: '#333',
            backgroundColor: '#fff',
          }}
          textStyle={{color: '#000'}}
        />
        {/* <View style={styles.container}>
          <Button style={styles.btn} status="basic">
            Random club
          </Button>
          <Button style={styles.btn} status="basic">
            All club
          </Button>
        </View> */}
        {
          allPosts.length === 0 ? <Text>No Events</Text> :(
          
          <ScrollView horizontal={true}>
            <Text>{succ}</Text>
            {
              allPosts.map(item =>{
                console.log('ERR: ',item.image)
                return <Card style={styles.card}
                key={item._id}
                 header={(props) => <Header title={item.title}/>}
                footer={props => <Footer id={item._id} user={item.user} post={item}/>}>
                    <Text>Date: {moment(item.date_created).fromNow()}</Text>
                    <Text>{item.title}</Text>
                    <Image
                        style={styles.avatar}
                        source={{uri: item.image ? item.image : baseImage}}
                      />
                    <Text>{item.description.substring(0, 40)}...</Text>
               </Card>
              })
            }
            
          
        </ScrollView>
          )
        }
        
      </React.Fragment>
    </Layout>
  </ApplicationProvider>
)
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
    padding:10,
    paddingLeft:20,
    borderRadius:10
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop:10
  },
  footerControl: {
    marginHorizontal: 2,
  },
  layout: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#80BCFF',
  },
  input: {
    marginRight: 10,
    marginLeft: 10,
  },
  row: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  avatar: {
    width: 300,
    height:200,
    marginTop: 20,
    marginBottom: 20,
  },
  btn: {
    width: '40%',
    height: 40,
    marginRight: 1,
  },
  actionHolders:{
    flexDirection:'row',
    justifyContent:'space-between'
  }
});

export default Directory;
