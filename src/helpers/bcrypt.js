const bcrypt = require('bcryptjs');

function hashPass(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
}

function comparePass(password, hashedPass) {
    return bcrypt.compareSync(password, hashedPass)
}

module.exports = {
    hashPass,
    comparePass
}