const {
    Router
} = require('express')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const router = Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const keys = require('../keys')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: keys.SENDGRID_API_KEY
    }
}))

router.get('/', async (req, res) => {
    res.render('auth/login', {
        title: 'Authentication',
        isLogin: true,
        errorLogin: req.flash('errorLogin'),
        errorRegister: req.flash('errorRegister')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const candidate = await User.findOne({
            email
        })
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('errorLogin', 'invalid password')
                res.redirect('/auth#login')
            }
        } else {
            req.flash('errorLogin', 'this email is not defind')
            res.redirect('/auth#login')
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/register', async (req, res) => {
    try {
        const {
            email,
            password,
            repeat,
            name
        } = req.body
        const candidate = await User.findOne({
            email
        })

        if (candidate) {
            req.flash('errorRegister', 'email is avaible')
            res.redirect('/auth#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: {
                    items: []
                }
            })
            await user.save()
            res.redirect('/auth#login')
            transporter.sendMail()
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router