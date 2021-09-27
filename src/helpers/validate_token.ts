function validateToken() {
    return new Promise ((resolve, reject) => {
      redisClient.get('qbo_token', function(e, tokenString) {
        if(tokenString) {
          const token = JSON.parse(tokenString)
          if (token.access_token && !isExpired(token.createdAt, token.expires_in)) {
            resolve({
              status: true,
              refreshable: true,
              token: token
            })
          } else if(token.access_token && 
            isExpired(token.createdAt, token.expires_in) && 
            !isExpired(token.createdAt, token.x_refresh_token_expires_in)) {
              resolve({
                status: false,
                refreshable: true,
                token: token
              })
          } else {
            resolve({
              status: false,
              refreshable: false,
              token: token
            }) 
          }
        } else {
          resolve({
            status: false,
            refreshable: false,
            token: null
          }) 
        }
      })
    })
  }

  function isExpired(createdAt, expires_in) {
    const isExpired = new Date().getTime() > createdAt + expires_in * 1000
    return isExpired
  }