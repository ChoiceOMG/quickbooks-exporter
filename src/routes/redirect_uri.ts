import express from 'express';
import { createNodeRedisClient } from 'handy-redis';
import { get_tokens } from '../helpers/get_tokens';
const client = createNodeRedisClient();

const app = express.Router()

app.use('', async (req, res) => {  
  const { code, state, realmId } = req.query
  const csrf_secret = await client.get("csrf_secret")

  if (code && state && realmId) {    
    if (typeof code === "string")
      if (csrf_secret === state) {
        get_tokens(code).then((response) => {
          console.log(response)
          res.sendStatus(200)
        })
      } else {
        res.send("Incorrect State").status(409)
      }
    } else {
    res.sendStatus(403)
    }
  }
)

export default app