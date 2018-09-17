const path = require('path');

module.exports = {
    port: 8080,
    staticPath: path.join(__dirname, './static/'),
    secret: 'lukeLiang'
}