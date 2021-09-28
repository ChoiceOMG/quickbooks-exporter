import axios from 'axios';
import qs from 'qs';
import { save_tokens } from './save_tokens';

export const refresh_access_token = async (refresh_token: string) => {
  const grant_type = 'refresh_token'
  const code = refresh_token
  
  const clientId = process.env.QBO_CLIENT_ID
  const clientSecret = process.env.QBO_CLIENT_SECRET
  const discover = process.env.QBO_OPENID_DISCOVER || ''

  const payload = { grant_type, code }
  const apiKey = clientId + ":" + clientSecret
  const auth_header = Buffer.from(apiKey).toString('base64')
  const openid_configuration = await axios.get(discover)
  const { token_endpoint } = openid_configuration.data

  await axios({
    method: 'post',
    url: token_endpoint,
    data: qs.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + auth_header
    }
  })
    .then((response) => save_tokens(response.data))
    .catch((error) => console.log(error.message))
}