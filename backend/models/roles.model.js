module.exports = (sequelize, Sequelize) => {
    const UserRoles = sequelize.define("roles", {
        name : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });
        /**
     * creates or finds a current user privilige
     * @param {String} roleName 
     * @returns UserRole Object
     */
    UserRoles.newPrivilige = async (roleName) => {

            const checkForRole = await UserRoles.findOne({where:{
                name: roleName
            }});
    
            if (!checkForRole){
                const newRole = await UserRoles.create({
                    name: roleName
                });
    
                if (newRole) {
                    return newRole
                };
            } else {
                return checkForRole;
            }
    
        }
    return UserRoles;
}