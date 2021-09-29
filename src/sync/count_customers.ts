import { createNodeRedisClient } from 'handy-redis';
import check_tokens from '../helpers/check_tokens';
import api from './api';
const client = createNodeRedisClient();


export const get_customer_count = async () => {
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
        query: `SELECT COUNT(*) FROM Customer`,
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