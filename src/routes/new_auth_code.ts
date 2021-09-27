
import axios from 'axios';
import qs from 'qs';

const get_tokens = async (authorizationCode: string) => {
    const grant_type = 'authorization_code' 
    const code = authorizationCode
    const redirect_uri = process.env.REDIRECT_URI
    const payload = {
        grant_type,
        code,
        redirect_uri
    }    
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(payload)
    }
    
    const openid_configuration = await axios.get('https://developer.api.intuit.com/.well-known/openid_configuration')

    const { authorization_endpoint, token_endpoint } = openid_configuration.data
    console.log('authorization_endpoint', authorization_endpoint)
    console.log('token_endpoint', token_endpoint)

   
    const response = await axios.post(token_endpoint, options)
    console.log('token_response', response)

    return response.data

  }

export default get_tokens