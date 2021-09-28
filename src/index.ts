import dotenv from 'dotenv';
import express, { urlencoded } from "express";
import logger from 'morgan';
import redis from 'redis';
import "reflect-metadata";
import { createConnection } from "typeorm";
import check_tokens from './helpers/check_tokens';
import get_authorize from './routes/get_authorize_code';
import notifications from './routes/notifications';
import redirect_uri from './routes/redirect_uri';


(async () => {
  dotenv.config()
  const app = express()
  const client = redis.createClient();
  client.on('connect', () => console.log("redis up"))
  let now = new Date();
  client.set('connected', String(now.getTime()));
  check_tokens();
  
  
  app.use(logger('dev'))
    .set('trust proxy', 1)
    .use(urlencoded({
      extended: true
    }))
    .all('/api/qbo/redirect_uri', redirect_uri)
    .all('/api/qbo/authorize', get_authorize) 
    .use('/api', notifications)
    .all('*', (_req, res) => {
      res.sendStatus(404)    
    })

  await createConnection()
    .then(() => app.listen(process.env.PORT))
    .then(() => console.log("quickbooks listening on", process.env.PORT))
    .catch(error => console.log(error.message))
  
  
  

})();


