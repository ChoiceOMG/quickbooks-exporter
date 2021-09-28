import axios from 'axios';
import qs from 'qs';
import { save_tokens } from './save_tokens';

export const get_tokens = async (authorization_code: string) => {
  const grant_type = 'authorization_code'
  const code = authorization_code
  const clientId = process.env.QBO_CLIENT_ID
  const clientSecret = process.env.QBO_CLIENT_SECRET
  const redirect_uri = process.env.REDIRECT_URI
  const discover = process.env.QBO_OPENID_DISCOVER || ''

  const payload = { grant_type, code, redirect_uri }
  const apiKey = `${clientId}:${clientSecret}`
  const auth_header = Buffer.from(apiKey).toString('base64')
  const openid_configuration = await axios.get(discover)
  const { token_endpoint } = openid_configuration.data

  await axios({
    method: 'post',
    url: token_endpoint,
    data: qs.stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth_header}`,
      Accept: 'application/json'
    }
  })
    .then((response) => save_tokens(response.data))
    .catch((error) => console.log(error.message))
}




