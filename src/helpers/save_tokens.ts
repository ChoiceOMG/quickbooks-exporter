import redis from 'redis';

type token_response = {
  expires_in: number;
  access_token: string;
  x_refresh_token_expires_in: number;
  refresh_token: string;
}

export const save_tokens = async (data: token_response) => {
  const { refresh_token, access_token, expires_in, x_refresh_token_expires_in } = data
  let now = new Date();
  let expires = new Date(now.getTime() + expires_in * 1000);
  let refresh_expires = new Date(now.getTime() + x_refresh_token_expires_in * 1000);

  const client = redis.createClient();
  client.on('connect', () => console.log("redis ready to save tokens"))  
  client.set('accessToken', access_token),
  client.set('accessToken_expires', String(expires.getTime())),  //60 minutes
  client.set('refreshToken', refresh_token),
  client.set('refreshToken_expires', String(refresh_expires.getTime())) //101 days
   
}