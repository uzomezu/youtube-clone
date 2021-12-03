const {validEmail, validPassword, validUsername} = require('./validator');


test("check for a valid email", ()=> {
    let email = "kmezu1@student.umgc.edu";
    let usernames = [
        "badurnm",
        "goodName2",
        "almostGood"
    ] 
    const isValidEmail = validEmail(email);
    for (const name of usernames){
        console.log(name + "is a good username ?", validUsername(name))
    }
    expect(isValidEmail).toEqual(true);
})