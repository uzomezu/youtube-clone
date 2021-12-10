require('dotenv').config();
const gmailJSON = require('../../client_secrect_kev_portfolio.json');

module.exports = {
    JWT_SECRET : process.env.JWT_SECRET,
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || '',
    db: {
        HOST : process.env.DB_HOST || '',
        SCHEMA : process.env.DB_SCHEMA || '',
        USER : process.env.DB_USER || '',
        PASS : process.env.DB_PASSWORD || '',
        PORT : process.env.DB_PORT || '',
        DIALECT : process.env.DB_DIALECT || '',
        SSL : process.env.DB_SSL || '',
        operatorAliases : process.env.DB_OPERATORALIASES || '',
        pool : {
            min : 0 ,
            max : 5 ,
            idle : 10000 ,
            acquire : 30000 
        }
    },
    gmail: {
        CLIENT_ID: process.env.GMAIL_CLIENT_ID,
        CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
        REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
        REDIRECT_URIS: gmailJSON.web.redirect_uris,
        ROOT_USER: process.env.GMAIL_ROOT_USER || "uzomezu@gmail.com"
    }
}