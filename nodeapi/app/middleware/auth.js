const crypto = require ('crypto-js');
const sql = require('../models/db.model');


    // Check if valid token
const isAuthorized = (req, res, next) => {

    try {
        if (req.body.token){
            let token = req.body.token;
            let id = req.body.userid;
            let selectQuery = 'SELECT employeeno_fld, token_fld FROM ?? WHERE employeeno_fld = ?'
            let query = sql.format(selectQuery,['accounts_tbl', id]);
        
            sql.query(query, (err, res)=>{
    
                if(res[0]['token_fld'] == token){
                    console.log('Token Authenticated')
                    req.body = req.body.load;
                    return next();
                }
    
                console.log('Error', err);
            });
        }else {
        res.status(401).end();
      }
        
    } catch (error) {
        
        throw error;
    }
}


// Token Generator

// const  b64charReplace = (msg) => {
//     let filter = msg
//     return filter.replace (/[=+/]/g, charToBeReplaced => {
//         switch (charToBeReplaced) {
//         case '=':
//             return '';
//         case '+':
//             return '-';
//         case '/':
//             return '_';
//         }
//     });
// }

const generateHeader = () => {
    let header = JSON.stringify({
        "alg" : "HS256",
        "typ" : "JWT",
        "app" : "GC CLIP",
        "dev" : "Parallel StartUp"
    })

    // let b64String = btoa(header);

    return Buffer.from(header).toString('base64').replace(/=/g, '');;
}

const generatePayload = (ue, en, iat) => {
    let load = JSON.stringify({
        "en": en,
        "ue": ue,
        "iat": iat,
        "iss": "Gerald Tagle",
        "isse": "GCCLIP@gordoncollege.edu.ph",
        "idate": new Date().getMilliseconds()
    });

    // let b64String = btoa(load);

    return Buffer.from(load).toString('base64').replace(/=/g, '');
}

const generateToken = (ue, en, iat) => {
    let payload = generatePayload(ue,en,iat);
    let header = generateHeader();

    // create a HMAC(hash based message authentication code) using sha256 hashing alg
    let siginature = crypto.HmacSHA256(header + '.' + payload,  "www.gordoncollege.edu.ph");
        
    // Returning the token    
    return header + '.' + payload + '.' + siginature;
    // return b64charReplace(siginature.toString(crypto.enc.Base64));

};

module.exports={
    generateToken,
    isAuthorized
}