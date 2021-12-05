const config = require('../config');
const Sequelize = require("sequelize");
const userRolesJSON = require('../user.roles.json');



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
db.roles = require('./roles.model')(sequelize, Sequelize);
db.videos = require('./videos.model')(sequelize, Sequelize);
db.comments = require('./comments.model')(sequelize, Sequelize);
db.tags = require("./tags.model")(sequelize, Sequelize);
db.channels = require('./channels.model')(sequelize, Sequelize);
db.categories = require('./categories.model')(sequelize, Sequelize);
// Relations: 

// The following relations show the structure for the database

db.users.belongsToMany(db.roles, {
    through: "priviliges"
});
db.roles.belongsToMany(db.users, {
    through: "priviliges"
});

db.users.belongsToMany(db.users, {
    as: {singular: "follower", plural: "followers"},
    through: "following"
});

db.users.hasMany(db.comments); 
db.comments.belongsTo(db.users);

db.comments.belongsToMany(db.comments, {
    as: {singular: "reply", plural: "replies"},
    through: "thread"
});

db.videos.hasMany(db.comments);
db.comments.belongsTo(db.videos);

db.users.hasMany(db.channels);
db.channels.belongsTo(db.users);

db.users.belongsToMany(db.channels, {
    as: {singular: "subscriber", plural: "subscribers"},
    through: "subscriptions"
});
db.channels.belongsToMany(db.users,{
    through: "subscriptions"
})

db.users.hasMany(db.videos);
db.videos.belongsTo(db.users);

db.channels.hasMany(db.videos);
db.videos.belongsTo(db.channels);

db.categories.belongsToMany(db.channels, {
    through: "genres"
});
db.channels.belongsToMany(db.categories, {
    through: "genres"
});

db.videos.belongsToMany(db.tags, {
    through: "videoTags"
});
db.tags.belongsToMany(db.videos, {
    through: "videoTags"
});

// ... initialize user roles

db.initRoles = async () => {
    const allPrivileges = userRolesJSON.allPriviliges;

    for (const role of allPrivileges) {
        const newRole = await db.roles.create({
            name: role
        });
        if (newRole) {
            console.log("new userRole has been created: ", newRole);
        }
    };

    return;
}

module.exports = db;