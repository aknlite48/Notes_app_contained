const notesRouter = require('express').Router()
const Note = require('../models/notes')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

//token processing
const getTokenFrom = (request) => {
    const authorize = request.get('authorization') //returns header with field authorization

    if (authorize && authorize.startsWith('Bearer ')) {
        return authorize.replace('Bearer ','')
    }
    return null
}

notesRouter.post('/',async (request,response)=>{
    const body = request.body
    let decode_token

    try {
        decode_token = jwt.verify(getTokenFrom(request),process.env.SECRET)
    }
    catch (error) {
        return response.status(401).json({error : "invalid token"})
    }

    const user = await User.findById(decode_token.id)
    
    const note = new Note(
        {
            content: body.content,
            important: body.important,
            user: user._id
        }
    )
    try {
        const savedNote = await note.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()
        return response.status(201).json(savedNote)
    }
    catch(error) {
        return response.status(400).json({error: "note validation"})
    }

})

notesRouter.get('/',(request,response)=>{
    Note.find({}).populate('user',{username:1,name:1})
    .then((result)=>{
      response.json(result)
    })
})

notesRouter.delete('/:id',async (request,response)=>{
    let decode_token

    try {
        decode_token = jwt.verify(getTokenFrom(request),process.env.SECRET)
    }
    catch (error) {
        return response.status(401).json({error : "invalid token"})
    }

    const user = await User.findById(decode_token.id)
    const id = request.params.id
    try {
        //await Note.remove
        await Note.deleteOne({_id:id})
    }
    catch (error) {
        return response.status(401).json({error : "note not found"})
    }

    user.notes = user.notes.filter((n)=>{return n!==id})
    await user.save()
    response.status(201).json({"status":"delete successful"})
    


})



module.exports = notesRouter