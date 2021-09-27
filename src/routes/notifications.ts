import dotenv from 'dotenv';
import Express from 'express';

dotenv.config()
const app = Express.Router()

app.post('/qbo/notification', (req, res) => {
    const body = req.body     
    const signature = req.get('intuit-signature');
    const whsecret = process.env.WEBOOK_SECRET || ""    
    console.log('signature', signature, 'body', body, 'whsecret', whsecret)
    res.sendStatus(204)
  })

export default app