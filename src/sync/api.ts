import axios from 'axios';
import qs from 'qs';

const qbo_baseurl = process.env.QBO_BASE_URL
const qbo_company = process.env.QBO_REALM_ID

const instance = axios.create({
  baseURL: `https://${qbo_baseurl}/v3/company/${qbo_company}`,
  headers: { Accept: 'application/json' },
  paramsSerializer: function (params) {
    return qs.stringify(params, {arrayFormat: 'brackets'})
  },
})

export default instance