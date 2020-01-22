const randomString = require('randomstring');

exports.generateRandomString = async (size) => {
    try {
        return randomString.generate(size);
    } catch (error) {
        throw Error('Unable to generate random string')
    }
}
