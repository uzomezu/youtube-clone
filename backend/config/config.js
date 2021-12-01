require('dotenv').config();

module.exports = {
    JWT_SECRET : process.env.JWT_SECRET,
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
            min : process.env.DB_MIN || '',
            max : process.env.DB_MAX || '',
            idle : process.env.DB_IDLE || '',
            acquire : process.env.DB_ACQUIRE || ''
        }
    }
}