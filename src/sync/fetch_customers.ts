import { createNodeRedisClient } from 'handy-redis';
import check_tokens from '../helpers/check_tokens';
import api from './api';
const client = createNodeRedisClient();


export const get_all_customers = async (startPos: number, maxResults: number ) => {
  return await check_tokens()
  .then(async () => {
    const accessToken = await client.get('accessToken')
    const customers = await api({
      url: '/query',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params:{
        query: `SELECT * FROM Customer STARTPOSITION ${startPos} MAXRESULTS ${maxResults}`,
        minorversion: 62
      },
    })
    .then((response) => response.data)
    .catch((error) => error.message)
     if (customers) return customers.QueryResponse
     else return false
  })
  .catch((error) => console.log(error.message))
}