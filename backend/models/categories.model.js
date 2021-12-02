module.exports = (sequelize, Sequelize) => {
    const Categories = sequelize.define("categories", {
        name:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        
    })

    return Categories;
}