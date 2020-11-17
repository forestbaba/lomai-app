import React,{useEffect, useState} from 'react';
import {
  ApplicationProvider,
  Card,
  Text,
  Layout,
  Input,
  Button,
  Avatar,
} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import * as eva from '@eva-design/eva';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../../helper/utilities';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';

const Header = (props) => (
  <View {...props}>
    <Text category="h6">{props.title}</Text>
    <Text category="s1">Click to move club detail</Text>
  </View>
);

export const Profile = (props) => {

  const [subs, setSubs] = useState([])
  const [subs2, setSubs2] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [userDetail, setUserDetails] = useState({})
  const [loading, setloadings] = useState(true)
  const [activeSections, setactiveSectionss] = useState([])

  useEffect(async() => {

    console.log('=======\\\=======', props)

    let user = await AsyncStorage.getItem('user_details');
    let parsedUser = JSON.parse(user)
    setUserDetails(parsedUser.user)
    fetchInterest(parsedUser.user.id )
    setTimeout(() => {
        setloadings(false)

    }, 1500);
    

  },[])

  onSearchChange=(text)=> {
    const filteredAssets = subs.filter(asset => asset.title.toLowerCase().indexOf(text.toLowerCase()) !== -1);
   
		if (filteredAssets) {
      setSubs(filteredAssets)
    }
     else {
			setSubs(setSubs2);
		}
  }

  const handleRefresh =()=>{
    // let parsedUser = JSON.parse(user)
    fetchInterest(userDetail.id )

  }
  

  const fetchInterest=(user)=>{
    axios.post(`${BASE_URL}post/fetchInterest`,{user: user })
    .then(event => {
      setSubs(event.data.subscription)
      setSubs2(event.data.subscription)
     AsyncStorage.setItem('interest',JSON.stringify(event.data.subscription))
    }).catch(err =>{
      setErrorMsg(err.message)
    })
  }
  const handleUnfollow =(postId)=>{

    data={
      user:userDetail.id,
      postId:postId
    }

    axios.post(`${BASE_URL}post/unsubscribe`,data)
    .then(event => {
      console.log('Unsub success')
     fetchInterest(userDetail.id)
    }).catch(err =>{
      let errms = err.response.data
      setErrorMsg(err.response.data.message)
    })

  }
  
  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <Button size="small" status="success" onPress={()=>handleUnfollow(props.postId)}>Unfollow</Button>
    </View>
  );

  _renderSectionTitle = section => {
    return(<View style={styles.header}>
             <Text style={styles.headerText}>{section.title}</Text>
          </View>)
  };
 
  _renderHeader = section => {
    return (
      <View style={styles.header_}>
        <Text style={styles.headerName}>{section.name}</Text>
        <Text style={styles.headerText2}>{section.description.substring(0, 45)}...</Text>
        <Text style={styles.headerText3}>click for details...</Text>
      </View>
    );
  };
 
  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>Start Date:    {moment(section.start_date).format('YYYY-MM-DD')}</Text>
        <Text>End Date:      {moment(section.end_date).format('YYYY-MM-DD')}</Text>
        <Text>Date created:  {moment(section.date_created).format('YYYY-MM-DD')}</Text>
          <Text>{section.name}</Text>
          <Avatar
            style={styles.avatar}
            size="giant"
            source={section.image ? {uri:section.image} : require('../../assets/primary-logo.png')}
          />
          <Text>{section.description}</Text>
          <View style={ styles.footerContainer}>
            <Button size="small" status="success" onPress={()=>handleUnfollow(section._id)}>Unfollow</Button>
          </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    setactiveSectionss(activeSections)
  };
 
 
  
  return (<ApplicationProvider {...eva} theme={eva.light}>
    <Layout style={styles.layout} level="1">
      {
        loading ? <ActivityIndicator size="large" color="#FFFFFF"/>:(
          <React.Fragment>

        {/* <Image
          style={{ width: 25, height: 25 }}
          source={require('../../assets/user.png')}
        /> */}
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onSearchChange}
            status="info"
            placeholder="Search"
            style={{
              borderColor: '#333',
              backgroundColor: '#fff',
            }}
            textStyle={{color: '#000'}}
          />
          <View style={styles.row}>
          <Text>{errorMsg}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.text} category="h4">
              Base on my interested
            </Text>
            </TouchableOpacity>
          </View>
          {
              subs.length === 0 ? (<Text>No Interest</Text>) : (
                <ScrollView horizontal={false}>
                      <Accordion
                        sections={subs}
                        activeSections={activeSections}
                        renderSectionTitle={_renderSectionTitle}
                        renderHeader={_renderHeader}
                        renderContent={_renderContent}
                        onChange={_updateSections}
                      />
                    {/* { subs.map((item) => {
                      return(
                        <Card style={styles.card} 
                        key={item.id}
                        header={() => <Header title={item.title}/> } 
                        footer={()=> <Footer postId={item._id}/>}>
                        <Text>Date: {moment(item.date_created).format('YYYY-MM-DD hh:mm')}</Text>
                        <Text>{item.name}</Text>
                        <Avatar
                          style={styles.avatar}
                          size="giant"
                          source={item.image ? item.image : require('../../assets/primary-logo.png')}
                        />
                        <Text>{item.description.substring(0, 45)}...</Text>
                      </Card>
                      )
                  })}  */}
               </ScrollView>
              )
  
           
  
          }
         
        </React.Fragment>
      
        )
      }
    </Layout>
  </ApplicationProvider>
)};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
    padding:10
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop:20
  },
  footerControl: {
    marginHorizontal: 2,
  },
  layout: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#80BCFF',
  },
  avatar: {
    width: "100%",
    height:200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius:0
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    color: '#FFFFFF',
  },
  container: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    textAlign: 'right',
  },
  row: {
    marginTop: 20,
  },
  header:{
    backgroundColor:'white',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    padding:10,
    paddingTop:15,
    marginTop:20,
    marginLeft:5,
    marginRight:5
  
  },
  header_:{
   
    backgroundColor:'white',
    paddingBottom:15,
    // marginBottom:20,
    marginLeft:5,
    marginRight:5,
    padding:5

  },
  content:{
    backgroundColor:'white',
    padding:15,
    marginLeft:5,
    marginRight:5,
     borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    marginBottom:10
    },
  headerText:{
    fontWeight:'bold',
    fontSize:20,
    paddingTop:15,
    paddingBottom:15,

    },
    headerName:{
      fontWeight:'bold'
    },
    headerText3:{
      textAlign:'right',
      fontStyle:"italic"
    }
});

export default Profile;
