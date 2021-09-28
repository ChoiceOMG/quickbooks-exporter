import express from 'express';
import { createNodeRedisClient } from 'handy-redis';
import OAuthClient from 'intuit-oauth';
const client = createNodeRedisClient();
const app = express.Router()

app.use('', async (_req, res) => {
  const clientId = process.env.QBO_CLIENT_ID
  const clientSecret = process.env.QBO_CLIENT_SECRET
  const redirectUri = process.env.REDIRECT_URI
  const csrf_secret = (Math.random() + 1).toString(36).substring(7)
  await client.set("csrf_secret", csrf_secret)  
  
  const oauthClient = new OAuthClient({
    clientId,
    clientSecret,
    environment: 'production',                                // ‘sandbox’ or ‘production’
    redirectUri
  })
  const authUri = oauthClient.authorizeUri({
    scope: [
      OAuthClient.scopes.Accounting, 
      OAuthClient.scopes.OpenId, 
      OAuthClient.scopes.profile,
      OAuthClient.scopes.email,
      OAuthClient.scopes.phone,
      OAuthClient.scopes.address,

    ],
    state: csrf_secret,
  })    
  res.redirect(301, authUri)

 
})

export default app