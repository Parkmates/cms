import bcrypt from 'bcryptjs';

function hashPass(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
}

function comparePass(password: string, hashedPass: string) {
    return bcrypt.compareSync(password, hashedPass)
}

export {
    hashPass,
    comparePass
}