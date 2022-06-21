const CryptoJS = require("crypto-js");
const encHex = require("crypto-js/enc-hex");
const aes = require("crypto-js/aes");
const padZeroPadding = require("crypto-js/pad-zeropadding");


require('dotenv').config({path: '../config/.env'});

const decryptPayload = (req, res, next) => {
    try {
        if(req.body){
            let ciphertext = req.body
            let key = encHex.parse(ciphertext.substr(43,32))
            let iv =  encHex.parse(ciphertext.substr(11,32))
        
            let decrypted = aes.decrypt(ciphertext.substr(75), key, {iv:iv, padding:padZeroPadding}).toString(CryptoJS.enc.Utf8);
            
            req.body = JSON.parse(decodeURIComponent(decrypted))
            // console.log(req.body);
        }
       
    } catch (error) {
        throw error;
    }
    next();
};



const encryptPayload = (msg) => {
    try {
        if(msg) {
            let key = process.env.DB_SECRET;
            let encryptMethod = 'AES-256-CBC';
            
            let encryptLength = parseInt(encryptMethod.match(/\d+/)[0]);
            let salt =  CryptoJS.lib.WordArray.random(16);
            let iv =  CryptoJS.lib.WordArray.random(256);
    
            let iterations = 999;
    
            let encryptMethodLength = encryptLength / 4;
            let hashKey = CryptoJS.PBKDF2(key, salt, {
            hasher: CryptoJS.algo.SHA512,
            keySize: encryptMethodLength / 8,
            iterations: iterations,
            });
    
            let encrypted = CryptoJS.AES.encrypt(JSON.stringify(msg), hashKey, {
            mode: CryptoJS.mode.CBC,
            iv: iv,
            });
    
            let encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    
            let json = {
                'ciphertext': encryptedString,
                'iv': CryptoJS.enc.Hex.stringify(iv),
                'salt': CryptoJS.enc.Hex.stringify(salt),
                'iterations': iterations
                
            }
            // console.log(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse((JSON.stringify(json)))));
            // this.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse((JSON.stringify(json)))))
            return {a: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse((JSON.stringify(json))))};
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {encryptPayload};