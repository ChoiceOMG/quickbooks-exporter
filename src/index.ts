import Tokens from 'csrf';
import dotenv from 'dotenv';
import express, { urlencoded } from "express";
import OAuthClient from 'intuit-oauth';
import logger from 'morgan';
import redis from 'redis';
import "reflect-metadata";
import { createConnection } from "typeorm";
import get_tokens from './routes/new_auth_code';
import notifications from './routes/notifications';
import redirect_uri from './routes/redirect_uri';


(async () => {
  dotenv.config()
  const app = express()
  const client = redis.createClient();
  const csrf = new Tokens();

  app.use(logger('dev'))
    .set('trust proxy', 1)
    .use(urlencoded({
      extended: true
    }))
    .all('/api/qbo/redirect_url', (req, res) => redirect_uri(req, res))
    .all('/api/qbo/authorize', (req, res) => {
      const clientId = process.env.QBO_CLIENT_ID
      const clientSecret = process.env.QBO_CLIENT_SECRET
      const redirectUri = process.env.REDIRECT_URI
      const oauthClient = new OAuthClient({
        clientId,
        clientSecret,
        environment: 'production',                                // ‘sandbox’ or ‘production’
        redirectUri
      })
      const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: 'testState',
      })

    
      res.redirect(301, authUri)
    })
    .all('/api/qbo/new_auth_code', async (req, res) => {
      const new_authorization_code  = String(req.query.code)      
      
      await get_tokens(new_authorization_code)
        .then((response)=> {
          res.sendStatus(202)
          console.log(response)
        })
        .catch((error) => {
          res.sendStatus(500)
          console.log(error.message)
        })
      
    
    })
    .use('/api', notifications)
    .all('*', (_req, res) => {
      res.sendStatus(404)    
    })      

  await createConnection()
    .then(() => app.listen(process.env.PORT))
    .then(() => console.log("quickbooks listening on", process.env.PORT))
    .catch(error => console.log(error.message))
  
  client.on('connect', function() {
     console.log("redis connected on ", process.env.REDIS_PORT);
  });  
  

})();


