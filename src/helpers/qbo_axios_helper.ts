import axios from "axios";
import redis from 'redis';

const client = redis.createClient();

const refreshToken = client.get('refreshToken')

const qbo_api = axios.create({
  baseURL: process.env.QBO_BASE_URL,  
  headers: {
    "Content-type": "application/json",
    "Authorization": ""
  },
  params: {
      Realm: ""
  } 
});
