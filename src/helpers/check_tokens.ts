import axios from 'axios';
import dotenv from 'dotenv';
import { createNodeRedisClient } from 'handy-redis';
import { refresh_access_token } from './refresh_access_token';


const check_tokens = async () => {
  dotenv.config()
  const client = createNodeRedisClient();

  const accessToken_expires = await client.get('accessToken_expires');
  const refreshToken_expires = await client.get('refreshToken_expires');
  
  let now = new Date();
  let expires = new Date(Number(refreshToken_expires))
  let seconds = (expires.getTime() - now.getTime()) / 1000;
  

  if (seconds < 2.592e+6) {
    const channel = process.env.NOTIFICATION_HOOK || ''
    const message = `Time to [Refresh QBO Auth Code](${process.env.AUTH_URL})`
    await axios.post(channel, {
      text: message,      
    })    
    .catch((error) => console.log('Error with auth code', error.message))
    return  
  } else {
    expires = new Date(Number(accessToken_expires))
    seconds = (expires.getTime() - now.getTime()) / 1000;
    console.log(seconds)

    if (seconds < 300) {
      console.log('Access token needs to be refreshed')
      const refreshToken = await client.get('refreshToken')
      if (refreshToken) 
      return await refresh_access_token(refreshToken)
      .catch((error) => console.log('Error refreshing access token', error.message))

    } else {
      return await client.get('accessToken');
    }
  }
}

export default check_tokens
