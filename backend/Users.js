const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const User = require('./User')
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    console.log("did it come here")
    console.log(req.body.first_name)
    console.log(req.body.last_name)
    console.log(req.body.email)
    console.log(req.body.password)

    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }
    console.log(userData)
        // console.log(last_name)
        // console.log(email)
        // console.log(password)

    User.findOne({
        where: {
            email: req.body.email
        }
    })

    //TODO bcrypt
    .then(user => {
            if (!user) {
                User.create(userData)
                    .then(user => {
                        console.log("is it checking?")
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        })
                        console.log('checking token')
                        res.json({ token: token })
                    })
                    .catch(err => {
                        res.send('error: ' + err)
                    })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.post('/login', (req, res) => {
    console.log("reqqqqq", req)

    User.findOne({
            where: {
                email: req.body.email,

                password: req.body.password
            }
        })
        //console.log("user.post worked")
        .then(user => {
            if (user) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ token: token })
                console.log('checking login user')
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
            where: {
                id: decoded.id
            }
        })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = users