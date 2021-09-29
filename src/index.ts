import dotenv from 'dotenv';
import express, { urlencoded } from "express";
import logger from 'morgan';
import "reflect-metadata";
import { createConnection } from "typeorm";
import get_authorize from './routes/get_authorize_code';
import notifications from './routes/notifications';
import redirect_uri from './routes/redirect_uri';
import { customer_sync } from './sync/customer_sync';



(async () => {
  dotenv.config()
  const app = express()
 
  app.use(logger('dev'))
  .set('trust proxy', 1)
  .use(urlencoded({extended: true}))
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

  customer_sync()

  })();


