const crypto = require('crypto-js');

const saltAndHashPassword = (password) => {
    const salt = crypto.lib.WordArray.random(16);
    const saltedPassword = password + salt;
    const hash = crypto.SHA1(saltedPassword);
    return {
        salt: salt.toString(),
        hash: hash.toString()
    };
}

const hashSaltedPassword = (password, salt) => {
    const saltedPassword = password + salt;
    const hash = crypto.SHA1(saltedPassword);
    return hash.toString();
}

const hashFilename = (filename, username) => {
    const saltedFilename = filename + username;
    const hash = crypto.SHA1(saltedFilename);
    return hash.toString();
};

module.exports = {saltAndHashPassword, hashSaltedPassword, hashFilename};
