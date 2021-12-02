module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define("category", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        
    })

    return Categories;
}