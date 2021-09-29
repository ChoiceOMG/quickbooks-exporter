import axios from 'axios';
import qs from 'qs';
import { save_tokens } from './save_tokens';

export const refresh_access_token = async (refresh_token: string) => {
  const grant_type = 'refresh_token'
  
  const clientId = process.env.QBO_CLIENT_ID
  const clientSecret = process.env.QBO_CLIENT_SECRET
  const discover = process.env.QBO_OPENID_DISCOVER || ''

  const payload = { grant_type, refresh_token }
  const apiKey = clientId + ":" + clientSecret
  const auth_header = Buffer.from(apiKey).toString('base64')
  console.log (auth_header)
  const openid_configuration = await axios.get(discover)
  const { token_endpoint } = openid_configuration.data
  console.log("refreshing access token")

  return await axios({    
    url: token_endpoint,
    method: 'post',    
    headers: {      
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + auth_header,
      Accept: 'application/json'
    },
    data: qs.stringify(payload),
  })
    .then((response) => {
      save_tokens(response.data)
      return response.data.access_token
    })
    .catch((error) => console.log('Error refreshing access token', error.message)) 
}