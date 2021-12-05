const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/');
const userRolesJSON = require('../user.roles.json');
const {validUsername, validEmail, validPassword} = require("../middlewear/validator");
const db = require('./index');
module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("user", {
        email : {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
        }
    });

    Users.authenitcate = async function(identifier, password){
    
        const checkEmail = await Users.findOne({where: {
            email: identifier
        }});
        const checkUsername = await Users.findOne({where: {
            username: identifier
        }});
        console.log((checkEmail!== null || checkUsername !== null));
        if (checkEmail !== null || checkUsername !== null) {
            const user = checkEmail !== null ? checkEmail : checkUsername;
            console.log(user)
            const dbPassword = user.password;
    
            const isPasswordCorrect = await bcrypt.compare(password, dbPassword);
            console.log(isPasswordCorrect)
            if (isPasswordCorrect){
                // password is correct, username or email is correct
                // time to tell controller to generate token
    
                return user;
    
            } else {
                return {message: "Error: identifier or password is incorrect."}
            }
        } else {
            return {message: "Error authenticating user."}
        }
    };
    
    // ... Log in Function which issues a jwt
    Users.logIn = async (req,res,next) => {
        try {
            const {identifier, password} = req.body;
            const user = await Users.authenitcate(identifier, password);

            if (user instanceof Users) {
                // ... respond with JWT

                const curUserRoles = await user.getRoles();

                let priviliges = [];

                for (const role of curUserRoles) {
                    var thingsICanDo = userRolesJSON[role.name].priviliges;

                    priviliges.concat(thingsICanDo);
                }

                const token = jwt.sign({
                    id: user.id,
                    priviliges: priviliges,
                    email: user.email
                },config.JWT_SECRET,{
                    expiresIn: "72h" // 72 hour expiration time
                });

                res.status(200).send({
                    user: user,
                    token: token
                })
            } else {

                var error = user;
                res.status(400).send({
                    error
                })
            }
        } catch (err) {
            res.status(500).send({message: err.message})
        }

    };
    // ... register function which will create a user
    Users.register = async (req,res,next) => {
        try {
            // grab data from req.body;

            const {email, username, password} = req.body;
            
            // ... Validate the incoming data
            
            const isValidEmail = validEmail(email);
            const isValidUserName = validUsername(username);
            const isValidPassword = validPassword(password);
            const response = {
                email: isValidEmail == true ? "Email is valid!" : "Error: Invalid email address.",
                username : isValidUserName,
                password : isValidPassword 
            };
            if (!isValidEmail || isValidUserName.errors.length > 0 || isValidPassword.errors.length > 0){
                // ... send back the errors
                res.status(400).send(response);
            } else {
                // ... all conditions validated
                var salt = bcrypt.genSaltSync(10);
                var hashedPass = bcrypt.hashSync(password, salt);

                const newUser = await Users.create({
                    email: email,
                    username: username,
                    password: hashedPass
                });
               
                // ... add the authenticated roles
                const authRole = await db.roles.newPrivilige("authenticated");
                await newUser.addRole(authRole);
                if(newUser.id == 1) {
                    const adminPrivilige = await db.roles.newPrivilige("admin");
                    await newUser.addRole(adminPrivilige);
                }
                res.status(201).send({
                    message: "Success! New user created.",
                    data: {
                        user: newUser,
                        roles: await newUser.getRoles()
                    }
                });
            }
            
        } catch (err) {
            res.status(500).send({message: err.message});
        }

    };

    Users.becomePriviliged = async (req,res,next) => {
        try{
            const userRole = await db.roles.newPrivilige(req.body.privilige);
        
            // assuming isAuth (user has a jwt during request)
    
            const user = req.user;
    
            const userPriviliges = await user.getRoles();
    
            if (!userPriviliges.includes(userRole)) {
                await user.addRole(userRole);
                res.status(200).send({
                    message: `${req.body.privilige} privilige added!`,
                    roles: await user.getRoles()
                })
            } else {
                await user.removeRole(userRole);
                res.status(200).send({
                        message: `${req.body.privilige} privilige removed.`,
                        roles : await user.getRoles()
                    });
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    };
    /**
     * Will validate an authenticated user from db
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    Users.isAuth = async (req,res,next) => {
        try{
            const bearerToken = req.headers.authorization;
            const onlyToken = bearerToken.slice(7,bearerToken.length);
            jwt.verify(onlyToken, config.JWT_SECRET, async(err, decoded)=>{
                if (err){
                    throw err
                } else {
                    req.user = await Users.findOne({where: {
                        id: decoded.id
                    }});
                    req.priviliges = decoded.priviliges
                    next();
                    return;
                }
            })
        } catch(err){
            res.status(500).send({message: err.message})
        }
    };
    Users.isAdmin = async (req,res,next) => {
        try{
            if (req.priviliges && req.user) {
                if(req.priviliges.includes("*")){
                    next();
                    return;
                } else {
                    res.status(403).send({message: "Error: Unauthorized access."});
                }
            } else {
                res.status(403).send({message: "Error: Unauthorized access."})
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    }
    Users.getMe = async (req,res,next) => {
        try {   
            if (req.user) {
                res.status(200).send(req.user);
            } else {
                res.status(403).send({message: "Error: User unauthorized or does not exist."});
            }
        } catch(err) {
            res.status(500).send({message: err.message});
        }
    }
    Users.getAll = async (req,res,next) => {
        try {
            const allUsers = await Users.findAll();
            if (allUsers) {
                res.statsu(200).send(allUsers);
            } 
        } catch(err) {
            res.status(500).send({message: err.message});
        }
    }
    Users.upDateName = async (req,res,next) => {
        try {
            if(req.user) {
                const updatedUser = await Users.update({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                },{
                    where: {
                        id: req.user.id
                    }
                });

                if(updatedUser){
                    res.status(200).send({
                        message: "first and last names updated!",
                        user: updatedUser
                    });
                }
            }
        } catch(err) {
            res.status(500).send({message: err.message})
        }
    }
    return Users;
}