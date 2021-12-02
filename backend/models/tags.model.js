module.exports = (sequelize, Sequelize) => {
    const Tags = sequelize.define("tag", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    });

    return Tags;
}