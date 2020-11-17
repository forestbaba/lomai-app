import RNFetchBlob from 'react-native-fetch-blob'
import {BASE_URL} from '../helper/utilities'
import querystring from "query-string"


let upload = (data, user) => {
  // data.user="5fa0af5347c43c8422af5323" 
  console.log('========', data)
  
  return RNFetchBlob.fetch('POST', `http://localhost:13000/api/v1/user/upload/${user}`, {
    // Authorization : "Bearer acce`ss-token",
    // otherHeader : "foo",
    'Content-Type' : 'multipart/form-data',
  }, data);
}
let upload2 = async (data,data2) => {
   let datax = await JSON.stringify(data2)
  return RNFetchBlob.fetch('POST', `${BASE_URL}post/create2/${querystring.stringify(data2)}`, {
    // Authorization : "Bearer acce`ss-token",
    // otherHeader : "foo",
    'Content-Type' : 'multipart/form-data',
  }, data);
}

module.exports = {upload, upload2};