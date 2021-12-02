const config = require('../config');
const Sequelize = require("sequelize");


const sequelize = new Sequelize(
    config.db.SCHEMA,
    config.db.USER,
    config.db.PASS, {
        host: config.db.HOST,
        port: config.db.PORT,
        dialect: config.db.DIALECT,
        dialectOptions: {
            ssl: config.db.SSL == true
        },
        operatorAliases: config.db.operatorAliases,
        pool : {
            min: config.db.pool.min,
            max: config.db.pool.max,
            acquire: config.db.pool.acquire,
            idle: config.db.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users.model')(sequelize, Sequelize);
db.videos = require('./videos.model')(sequelize, Sequelize);
db.comments = require('./comments.model')(sequelize, Sequelize);
db.tags = require("./tags.model")(sequelize, Sequelize);
db.channels = require('./channels.model')(sequelize, Sequelize);
db.categories = require('./categories.model')(sequelize, Sequelize);
// Relations: 

// The following relations show the structure for the database

db.users.hasMany(db.comments); 
db.comments.belongsTo(db.users);

db.videos.hasMany(db.comments);
db.comments.belongsTo(db.videos);

db.comments.hasMany(db.comments, {as: "replies"});

db.users.hasMany(db.channels);
db.channels.belongsTo(db.users);

db.users.hasMany(db.videos);
db.videos.belongsTo(db.users);

db.channels.hasMany(db.videos);
db.videos.belongsTo(db.channels);

db.categories.channelsToWatch = db.categories.belongsToMany(db.channels, {
    through: "channels_in_category",
    foreignKey: "channels",
    as: "channels_to_watch"
});


db.videos.belongsToMany(db.tags, {
    through: "videoTags"
});
db.tags.belongsToMany(db.videos, {
    through: "videoTags"
});


module.exports = db;