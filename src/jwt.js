const jwt = require('jsonwebtoken');
const config = require('./../config');

const getToken = payload => jwt.sign(payload, config.secret);

module.exports = getToken;