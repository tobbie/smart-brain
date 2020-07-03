
const httpRequest = (url, method, headers, body) => {
 if(body){
   return fetch(url, {
        method,
        headers,
        body :JSON.stringify(body)
    }).then((response) => {
        return response.json();
    }).catch((error) => {
        return error;
    })
 }else{
    
    return fetch(url, {
        method,
        headers,
    }).then((response) => {
        return response.json();
    }).catch((error) => {
        return error;
    })

 }

}

const httpHeaders = (token = '') => {
    return {'Content-type': 'application/json',
             'Authorization': token
                    }
}


module.exports = {
    httpRequest,
    httpHeaders
    
}
