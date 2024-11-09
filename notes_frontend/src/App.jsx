import { useState,useEffect } from "react";
import axios from 'axios'

//change when going from dev to prod

//const base_url = "http://localhost:3001/api/notes"
const base_url = "/api/notes"

const App = (props) => {

  const [notes,setNotes] = useState([])
  const [newnote,setNewNote] = useState('')
  const [to_sort,set_sort] = useState(0)
  const [isImp,setImp] = useState(false)
  const [username,set_username] = useState('')
  const [password,set_password] = useState('')
  const [user,set_user] = useState(null)

  /*
  const hook = () => {
    //console.log('effect')
    axios
      .get(base_url)
      .then(response => {
        //console.log('promise fulfilled')
        setNotes(response.data)
      })
      .catch(response=>{
        console.log("server load failed")
      })
  }
  
  useEffect(hook, [])
  */

  const hook1 = () => {
    //console.log('effect')
    const user_url = "/api/users"
    if (user) {
      axios
      .get(user_url+'/'+user.id)
      .then(response => {
        //console.log('promise fulfilled')
        setNotes(response.data[0].notes)
      })
      .catch(response=>{
        console.log("server load failed")
      })
    }

  }
  
  useEffect(hook1, [user])



  const user_prevent_reload = () =>{
    const user_JSON = window.sessionStorage.getItem('user_json')
    const temp_user = JSON.parse(user_JSON)
    const user_url = "/api/users"
    if (user_JSON!='') {
      set_user(temp_user)
    }
  }

  useEffect(user_prevent_reload,[])

  const handleLogin = async (event) => {
    event.preventDefault()
    const login_url = "/api/login"
    try {
      const credentials = {username: username,password: password}
      const recieved_token = await axios.post(login_url,credentials)
      //console.log(recieved_token.data)
      const temp_user = recieved_token.data
      set_user(temp_user)
      window.sessionStorage.setItem('user_json',JSON.stringify(recieved_token.data))
      set_username('')
      set_password('')

    }
    catch (error) {
      alert('login error')
    }
  }

  const handleLogout = () => {
    window.sessionStorage.setItem('user_json','')
    set_user(null)
    setNotes([])
  }

  const addNote = (event)=>{
    event.preventDefault()
    const newnote1 = {
      id:(notes.length+1),
      content: newnote,
      important: Math.random() < 0.5
    }
    const auth_obj = {
      headers: {Authorization: `Bearer ${user.token}`}
    }
    axios
    .post(base_url,newnote1,auth_obj)
    .then(response=>{
      //console.log("connection")
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
    .catch(response=>{
      //console.log('No connection')
      setNewNote('')
    })
  }

  const deleteNote = (id)=>{
    const auth_obj = {
      headers: {Authorization: `Bearer ${user.token}`}
    }
    axios
    .delete(`${base_url}/${id}`,auth_obj)
    .then(()=>{
      //alert(`Deleted ${response.body.content}`)
      //console.log(response)
      setNotes(notes.filter((n)=>{return n.id!==id}))
    })
    .catch(()=>{
      console.log("Delete failed")
    })
  }

  const changeImp = (id) => {
    let c_note = notes.find((n)=>{return n.id===id})
    c_note.important = c_note.important ? false : true
    axios
    .put(`${base_url}/${id}`,c_note)
    .then(response=>{
      setNotes(notes.map((n)=>{
        if (n.id===id) {
          return response.data
        }
        else {
          return n
        }
      }))
    })
    .catch(()=>{
      console.log('priority update failed')
    })
  }

  const onchangefun = (event)=>{
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }
  
  
  const To_rend = () =>{
    let rf1
    if (to_sort===0) {
      rf1 = notes
    }
    else if (to_sort===1) {
      rf1 = notes.toSorted((a,b)=>{
        let x = a.content
        let y = b.content
        if (x<y) {
          return -1
        }
        if (x>y) {
          return 1
        }
        return 0
      })
    }
    else if (to_sort===2) {
      rf1 = notes.toSorted((a,b)=>{
        let x = a.content
        let y = b.content
        if (x<y) {
          return 1
        }
        if (x>y) {
          return -1
        }
        return 0
      })
    }
    
    let rf2 = isImp ? rf1.filter((n)=>{return n.important}) : rf1
    /*
    return (
      <div>
      <button onClick={()=>{if (isImp) {setImp(false)} else {setImp(true)}}}>Show Imp</button>
      <button id='jtop' onClick={()=>{if (to_sort===0) {set_sort(1)} if (to_sort===1) {set_sort(2)} if (to_sort===2) {set_sort(0)}}}>{sort_display[to_sort]}</button>
        <ul>
        {rf2.map((note)=> {return <li key={note.id}>{note.content} <button onClick={()=>{changeImp(note.id)}}>{note.important?'U':'I'}</button><button onClick={()=>{deleteNote(note.id)}}>X</button></li>})}
        </ul>
      </div>
    )
    */

    return (
      <div className="notes-wrapper">
      <div className="notes-container">
      {rf2.map(note => (
          <div key={note.id} className="note-card">
                    <div className="note-buttons">
                        <button className="edit-button" onClick={() => {}}>Edit</button>
                        <button className="delete-button" onClick={() => {deleteNote(note.id)}}>Delete</button>
                    </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                  <span className="note-id">#{note.id.slice(0, 8)}</span>
              </div>
          </div>
      ))}
  </div>
  <button className="add-button" onClick={()=>{}}>+</button>
  </div>
    );
  }
  
  const sort_display = ['↑','↓','-']


  const Login_portal = () => {
    if (!user) {
    return (
      <div className="login-container">
      <div class="login-box">
      
        <form onSubmit={handleLogin}>
          <div className="input-group"> <label htmlFor="username"></label> <input type="text" value={username} name="username" placeholder="Username" onChange={(event)=>{set_username(event.target.value)}}/></div>
          <div className="input-group"> <label htmlFor="password"></label> <input type="password" value={password} name="password" placeholder="Password" onChange={(event)=>{set_password(event.target.value)}}/></div>
      
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
      </div>
    )
  }
  else {
    return (
      <div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    )
  }
}

  const Add_portal = () => {
    if (user) {
    return (
      <div>
      <form onSubmit={addNote}>
        <input value={newnote} onChange={onchangefun}/>
        <button type="submit">save</button>
      </form> 
      </div>
    )
  }
}


  return (
    <div className="main_body">
      {Login_portal()}


      {(user) ? To_rend() : null}
      


      {(user) ? Add_portal() : null}


    </div>
  )
}


export default App;