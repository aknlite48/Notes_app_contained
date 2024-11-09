const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')
//const { request, response } = require('express')

usersRouter.post('/',async (request,response)=>{
    const {username,name,password} = request.body
    if (!username || !name || !password) {
        response.status(400).json({error: "missing fields"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)

    const new_user = new User({
        username : username,
        name : name,
        passwordHash : passwordHash
    })

    new_user.save()
    .then((posted_user)=>{
        response.status(201).json(posted_user)
    })
    .catch((error)=>{
        response.status(400).json({error : error.name})
    })

})

usersRouter.get('/',(request,response)=>{
    User.find({}).populate('notes',{ content: 1, important: 1 })
    .then((result)=>{
        response.json(result)
    })
})

usersRouter.get('/:user_id',async (request,response)=>{
    const qu_id = request.params.user_id
    try {
        result = await User.find({_id:qu_id}).populate('notes',{ content: 1, important: 1 })
        
        return response.json(result)
        
    }
    catch (error) {
        return response.status(400).json(error)
    }

})

module.exports = usersRouter