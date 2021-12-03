const {validEmail, validPassword, validUsername} = require('./validator');


test("check for a valid email", ()=> {
    let email = "kmezu1@student.umgc.edu";

    const isValid = validEmail(email);

    expect(isValid).toEqual(true);
})