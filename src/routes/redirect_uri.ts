import { Request, Response } from "express";
import redis from 'redis';

const client = redis.createClient();

export default (req: Request, res: Response) => {
    let now = new Date();
    let expires = new Date(now.getTime() + req.body.expires_in * 1000);
    client.set('accessToken', req.body.accessToken)
    client.set('expires', expires.toString())  //60 minutes
    expires = new Date(now.getTime() + req.body.x_refresh_token_expires_in * 1000);
    client.set('refreshToken', req.body.refreshToken)
    client.set('refresh_token_expires', expires.toString()) //101 days
    res.sendStatus(204)
  }