const bcrypt = require('bcrypt');

async function encrypt(password){
    const hashedPassword = await new Promise((resolve, reject) => {
        
        bcrypt.hash(password, 12, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
      })
    
    return await hashedPassword;
}  

async function pw_check(myPlaintextPassword, hash){

    const plaintext = await new Promise((resolve, reject)=>{
        finalNodeGeneratedHash = hash.replace('$2y$', '$2b$');
        console.log(finalNodeGeneratedHash)
        bcrypt.compare(myPlaintextPassword, finalNodeGeneratedHash, function(err, result) {
            if (err) reject(err)
            resolve(result)
        });
    })
    return await plaintext;
}

module.exports = {encrypt, pw_check};