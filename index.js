require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/notes')

app.use(express.json())
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')
app.use('/api/users',usersRouter)
app.use('/api/notes',notesRouter)
app.use('/api/login',loginRouter)

//app.use(express.json()) //converts json of request body to js object

const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

/*
//*
app.post('/api/users',(request,response)=>{
  const {username,name,password} = request.body
  const saltRounds = 10
  let passwordHash
  bcrypt.hash(password, saltRounds)
  .then((result)=>{
    passwordHash=result
  })

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

app.get('/api/users',(request,response)=>{
  User.find({})
  .then((result)=>{
    response.json(result)
  })
  .catch((error)=>{
    response.status(400).json({error:error.name})
  })
})
//*
*/

/* shifted to controllers/notes.js
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    console.log('content missing')
    return response.status(400).json({error:'content missing'})
  }
  console.log('post attempt')
  const note = new Note({
    content: body.content,
    important: Boolean(body.important)
  })

  note.save()
  .then((posted_note)=>{
    response.json(posted_note)
  })
  .catch(error=>{
    response.status(400).json({error: error.name})
  })
  
})

app.get('/',(request,response)=>{
  response.send('<h1>Welcome page</h1>')
})

app.get('/api/notes',(request,response)=>{
  Note.find({})
  .then((result)=>{
    response.json(result)
  })
})

app.get('/api/notes/:id',(request,response)=>{
  //const id = request.params.id

  Note.findById(request.params.id).then((note) => {
    response.json(note)
  })
  .catch(()=>{
    response.status(404).json({error : 'not found'})
  })
})

app.put('/api/notes/:id',(request,response)=>{
  const note = {
    content: request.body.content,
    important: request.body.important
  }
  Note.findByIdAndUpdate(request.params.id,note,{ new: true,runValidators: true, context: 'query' })
  .then((n)=>{
    response.json(n)
  })
  .catch((error)=>{
    response.json(error)
  })
})

app.delete('/api/notes/:id',(request,response)=>{
  Note.findByIdAndDelete(request.params.id)
  .then(()=>{
    response.status(204).end()
  })
  .catch(()=>{
    response.json(error)
  })
})
*/



/*
app.put('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  const body = request.body
  const note = {
    id: body.id,
    content: body.content,
    important: body.important
  }
  notes = notes.map((n)=>{
    if (n.id===id) {
      return note
    }
    else {
      return n
    }
  })
  response.json(note)

})

app.delete('/api/notes/:id',(request,response)=>{
  const id = request.params.id
  notes = notes.filter((n)=>{return n.id!==id})
  //response.json(request)
  response.status(204).end()
})
*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})