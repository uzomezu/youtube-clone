module.exports = (sequelize, Sequelize) => {
    const Tags = sequelize.define("tags", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
    });

    return Tags;
}