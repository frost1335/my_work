const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'account is registered !',
        html: `
            <h1>Salom</h1>
        `
    }
}