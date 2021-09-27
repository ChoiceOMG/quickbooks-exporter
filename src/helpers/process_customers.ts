export const insertAndUpdateCustomers = async (token) => {
    getTotalCount('customer', token)
    .then( async (count)=> {
      if (isNaN(parseInt(count))) {
        throw 'Parase Int Error'
      }
      let total = Math.ceil(parseInt(count) / 1000)
      console.log('check customer page count', total)
      const pageCount = 1000
      const rootPath = env == 'production' ? config.QBO_API_PRODUCTION_ROOT : config.QBO_API_DEVELOPMENT_ROOT
      for (let i = 0; i < total; i++) {
        const startPos = i * pageCount + 1
        const getCustomerQuery = `SELECT * FROM Customer STARTPOSITION ${startPos} MAXRESULTS ${pageCount}`
        const path = `${rootPath}/v3/company/${token.realmId}/query?query=${encodeURI(getCustomerQuery)}&minorversion=40&format=json`
        var options = {
          method: 'get',
          url: path,
          headers: { 
            'Authorization': `Bearer ${token.access_token}`
          }
        };
        
        await axios(options)
          .then(function (response) {
            const customers = response.data.QueryResponse.Customer
            const data = []
            customers.forEach(el => {
              data.push(formatCustomer(el))
            });
          
            CustomerService.bulkAdd(data, function(err, response) {
              if(!err) {
                console.log('customers successfully synced')
              } else {
                console.log('customers sync failed', err)
              }
            })
        })
        .catch(error=> {
          console.log('axios error', error)
          throw (error)
        })
      }
    })
  }

export const syncCustomers = async () => {
    validateToken()
      .then(validateRes => {
        if(validateRes.status) {
          const token = validateRes.token
          insertAndUpdateCustomers(token)
        } else if(validateRes.refreshable) {
          refreshToken(validateRes.token)
          .then(value=>{
            insertAndUpdateCustomers(value.token)
          })
        }
      })
      .catch(validateErr => {
        console.log('sync customer error', validateErr)
      })
  }

export const getTotalCount = async (type, token) => {
    return new Promise((resolve, reject)=> {
      let sql = `SELECT COUNT(*) FROM ${type=='customer' ? 'customer' : 'invoice'}`
      const rootPath = env == 'production' ? config.QBO_API_PRODUCTION_ROOT : config.QBO_API_DEVELOPMENT_ROOT
      const path = `${rootPath}/v3/company/${token.realmId}/query?query=${encodeURI(sql)}&minorversion=40&format=json`
      var options = {
        method: 'get',
        url: path,
        headers: { 
          'Authorization': `Bearer ${token.access_token}`
        }
      };
      axios(options)
      .then(function (response) {
        console.log('response in get total count', response.data.QueryResponse.totalCount)
        const count = response.data.QueryResponse.totalCount
        resolve(count)
      })
      .catch(err=> {
        console.log('error response in get total count', err)
        throw(err)
      })
    })
  }