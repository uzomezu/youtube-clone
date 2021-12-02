module.exports = (sequelize, Sequelize) => {
    const Channels = sequelize.define("channels", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        
    })

    return Channels;
}