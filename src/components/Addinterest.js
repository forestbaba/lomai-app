import React from 'react';
import {
  ApplicationProvider,
  Input,
  Button,
  Layout,Datepicker,Icon
} from '@ui-kitten/components';
import {StyleSheet, View, Text, Image} from 'react-native';
import * as eva from '@eva-design/eva';
import moment from 'moment';
import axios from 'axios';
import {BASE_URL} from '../helper/utilities';
import AsyncStorage from '@react-native-community/async-storage';
import pick from '../helper/picker';
import querystring from "query-string"



class AddInterest extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      start_date:new Date(),
      end_date:new Date(),
      title:"",
      name:"",
      description:"",
      errorMsg:"",
      avatarSource:null,
      data:{},
      edit: false,
      editData:{}
    }
  }

  componentDidMount(){
    //console.log('ERR: ===>>>', this.props.route.params)

    if(this.props.route.params){
      const {post} = this.props.route.params;
      console.log('TTT: ', post)
      this.setState({edit: true, 
        editData: this.props.route.params,
        title: post.title,
        name: post.name,
        description: post.description,
        avatarSource: post.image ? post.image : null,
        start_date:  new Date(),
        //end_date: post.end_date ? moment(post.end_date).format('YYYY-MM-DDhh:mm:ssZ') : new Date(),
      })
    }

  }

   CalendarIcon = (props) => (
    <Icon {...props} name='calendar'/>
  );

   handleSubmit = async () => {

    let userDetails = await AsyncStorage.getItem('user_details')
    let userObject = JSON.parse(userDetails);
    console.log('**********', userObject.user.id)
    let today = moment();

     if(this.state.title === '' || this.state.name === '' || this.state.description === ''){
       this.setState({errorMsg:'All fields are required'})
    } else if(moment(this.state.start_date).isBefore(today)){
      this.setState({errorMsg:'invalid start date'})
     }
     else if(moment(this.state.end_date).isBefore(today)){
      this.setState({errorMsg:'invalid end date'})
     }
     else if(moment(this.state.end_date).isBefore(this.state.start_date)){
      this.setState({errorMsg:'End date must be greater than start date'})
     }
     else if(this.state.avatarSource === null){
      this.setState({errorMsg:'image is required'})
     }
     else{
       
          this.setState({errorMsg:''})
          data={
            name:        this.state.name,
            title:       this.state.title,
            description: this.state.description,
            date:        this.state.date,
            start_date:  this.state.start_date,
            end_date:    this.state.end_date,
            user:        userObject.user.id,
          }
          this.state.data.name= this.state.name,
          this.state.data.title= this.state.title,
          this.state.data.description= this.state.description,
          this.state.data.date= this.state.date,
          this.state.data.start_date= this.state.start_date,
          this.state.data.end_date= this.state.end_date,
          this.state.data.user= userObject.user.id

      

          let photo={
            uri:this.state.avatarSource.uri,
            type:'image/jpeg',
            name:"image.jpg"
          }
          const dataS = new FormData();
              dataS.append('image',photo)
              let res = await fetch(
                `${BASE_URL}post/create2/${querystring.stringify(data)}`,
                {
                  method: 'post',
                  body: dataS,
                  headers: {
                    'Content-Type': 'multipart/form-data; ',
                  },
                }
              );
              let responseJson = await res.json();
              if (responseJson.error === false) {
                alert('Post created');
                this.setState({avatarSource: null})
                this.props.navigation.navigate('home')
              }else{
                alert('Something went wrong');
              }
     }
 
   }


 show() {
  pick((source, data) => {
      this.setState({ 
          avatarSource: source, 
          selected: true,
          data: data })
  });
}

  render() {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.layout}>
         <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
          <React.Fragment>
          <Text style={styles.title}>Title</Text>
            <Input style={styles.input} 
            multiline={true} placeholder="Title"
            value={this.state.title}
            onChangeText={title=>this.setState({title})} />
            <Text style={styles.title}>Name</Text>
            <Input style={styles.input} multiline={true} 
            placeholder="Name"   
            value={this.state.name}
             onChangeText={name=>this.setState({name})} />
             <Text style={styles.title}>Start Date</Text>
            <Datepicker
            placeholder='Start Date'
            style={{width:'95%'}} 
            // value={this.state.start_date}
            date={this.state.start_date}
            onSelect={nextDate => this.setState({start_date:nextDate})}
          />
         <Text style={styles.title}>End date</Text>
            <Datepicker
            placeholder='End Date'
            style={{width:'95%'}} 
            // value={this.state.end_date}
            date={this.state.end_date}
            onSelect={nextDate => this.setState({end_date:nextDate})}
          />
          <Text style={styles.title}>Description</Text>
            <Input
              style={styles.input}
              multiline={true}
              placeholder="Description"
              value={this.state.description}
              onChangeText={description=>this.setState({description})}
              textStyle={{minHeight: 200}}
            />
            
              <Text onPress={this.show.bind(this)} style={styles.title}>Select Image</Text>
              <Image
                style={styles.avatar}
                source={this.state.avatarSource}
              />
            <Button style={styles.btn} 
            onPress={this.handleSubmit}
            status="basic">
              Submit
            </Button>
          </React.Fragment>
        </Layout>
      </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

export default AddInterest;
