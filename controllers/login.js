const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/',async (request,response)=>{

    const body = request.body
    const username = body.username
    const password = body.password

    const user = await User.findOne({username: username})

    let pass_valid = false
    if (user) {
        pass_valid = await bcrypt.compare(password,user.passwordHash)
    } 

    if (!pass_valid) {
        return response.status(401).json({error:'invalid username or password'})
    }

    const userToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userToken,process.env.SECRET)

    response.status(200).send({token,username: user.username,name: user.name, id:user.id})
})

module.exports = loginRouter