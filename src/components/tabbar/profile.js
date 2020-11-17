import React from 'react';
import {ApplicationProvider, Text, Button} from '@ui-kitten/components';
import {StyleSheet, View, Image, Alert} from 'react-native';
import * as eva from '@eva-design/eva';
import {Avatar, Layout} from '@ui-kitten/components';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {BASE_URL} from '../../helper/utilities'
import axios from 'axios';
import ImagePick from 'react-native-image-picker'
import pick from '../../helper/picker';
import {upload} from '../../helper/upload.js';
import Toast from 'react-native-simple-toast';

// import request from 'request';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      user:{},
      imagePath:'../../assets/user.png',
      msg:"",

      type: "",
      image: null,
      files: '',
      nImage:[],

      avatarSource: null,
      profilepic: '',
      data: null,
      selected: false,

      userId:"5fa0af5347c43c8422af5323"
    }
  }

async componentDidMount (){
    let name=''
   let uDetails = await AsyncStorage.getItem('user_details')
   let xu = JSON.parse(uDetails);
   console.log('=======KKK=======', xu.user)
   this.setState({user: xu.user, profilepic: xu.user.image})

  }

  handleLogout =()=> {
    this.props.navigation.navigate('Home')
 }

 show() {
  pick((source, data) => {
    console.log('==============================oo==', source)

      this.setState({ 
          avatarSource: source, 
          selected: true,
          data: data })

  }); 

}
 upload=async()=> {


  let photo={
    uri:this.state.avatarSource.uri,
    type:'image/jpeg',
    name:"image.jpg"
  }
  const data = new FormData();
      data.append('image',photo)
      let res = await fetch(
        `${BASE_URL}user/upload/${this.state.user.id}`,
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      if (responseJson.error === false) {
        alert('Upload Successful');
        this.setState({avatarSource: null})
      }else{
        alert('Something went wrong');
      }
}
 opengallery=()=>{

  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true
  }).then(image => {
    console.log('**', image)
    let formdata = new FormData();



    var data = new FormData();

    console.log('=======', image)
    console.log('===101====',Object.keys(image))
    data.append('image', image.file );
    data.append('home: ', '12121');


    var config = {
      method: 'post',
      url: `${BASE_URL}user/upload2`,
      headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
      },
      data: data,
  };

  axios(config)
      .then((response) => {
          console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
          console.log(error);
      });


  });
 }

  pickMultipleImages =async () => {

    ImagePick.showImagePicker ({maxWidth:500, maxHeight:500}, response => {
      if(response.didCancel){
        return;
      }

      const img={
        uri:response.uri,
        type:response.type,
        name:response.fileName || response.uri.substr(response.uri.indexOf('/') + 1)
      }

      console.log('@@@@@@@@@@@@@@: ', img)

      let nI = this.state.nImage.concat(img)
      this.setState({nImage: nI})
      setTimeout(() => {
        console.log('^^^^^^^',Object.keys(this.state.nImage))
        console.log('^^^^1^^^',nI)
      }, 1000);

      let payload = new FormData()
    payload.append('image', img)

    const config={
      body: payload,
      method: 'POST',
      header:{
        'Content-Type':'multipart/form',
      }
    }

    setTimeout(() => {
      
    const response2 =  fetch(`${BASE_URL}user/upload`, config);
    console.log('RESPONSE: ', response)
    return response2;
    }, 2000);
    })

    
}

renderImage(image) {
  return <Image style={{ width: '100%', height: 500, resizeMode: 'cover', marginBottom: 6, borderRadius: 2, borderColor: 'green', borderWidth: 1, }} source={image} />
}
renderAsset(image) {
  if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
    return this.renderVideo(image);
  }
  return this.renderImage(image);
}
  render() {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.layout} level="1">
          <React.Fragment>
            <View style={styles.avatarrow}>
              <Image
                style={styles.avatar}
                source={{uri: this.state.avatarSource !== null ? this.state.avatarSource.uri : this.state.profilepic}}
              />
              <Text onPress={this.show.bind(this)} style={styles.changeButton}>Change</Text>
             
             
            </View>
            {
                this.state.avatarSource !== null ?  <Text onPress={this.upload} style={styles.uploadButton}>Upload</Text> : null
              }
            {this.state.image ? this.renderAsset(this.state.image) : null}

            <View style={styles.nameRow}>
              <Text style={styles.text}>
                {this.state.user.username}
              </Text>
              <Text style={styles.text} category="h4">
                {this.state.user.name}
              </Text>
            </View>
            <View style={styles.row}>
              
              {/* <Button
               style={styles.button}
                onPress={() => this.props.navigation.navigate('contact')}
                status="basic">
                Notification Settings
              </Button> */}
              <Button
              style={styles.button}
                onPress={() => this.props.navigation.navigate('profileDetail')}
                status="basic">
                User Settings
              </Button>

              {this.state.user.is_admin ? (
                <Button
                style={styles.button}
                 onPress={() => this.props.navigation.navigate('userslist')}
                 status="basic">
                 Upgrade User
               </Button>  ) : null}
              
              <Button style={styles.btn} 
                  onPress={this.handleLogout}
                  status="basic">
               Logout
            </Button>
            </View>
           
          </React.Fragment>
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
    padding:10
  },
  avatar: {
     width: 100,
     height:100,
     borderRadius:50
  },
  row: {
    marginTop: 20,
    width:'100%',
  },
  nameRow: {
    marginTop: 5,
    width:'100%',
    paddingLeft:20
  },
  // avatarrow: {
  //   justifyContent:'center',
  //   alignItems:'center',
  //   marginTop: 20,
  //   backgroundColor:'#F9F9F9',
  //   borderRadius:100,
  //   width:100,
  //   height:100
  // },
  button:{
    width:'100%',
    padding:5,
    marginTop:5
  },
  text:{
    fontWeight:'bold'
  },
  uploadButton:{
    marginLeft:5,
    padding:10,
    color:'black',
    backgroundColor:'white',
    borderRadius:50,
    marginTop:10,
    borderTopLeftRadius:10
  },
  changeButton:{
    marginTop:10,
    marginBottom:10,
    fontWeight:'bold',
    marginLeft:16
  }
});

export default Profile;
