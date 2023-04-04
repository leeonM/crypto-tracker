import React, {useState} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate} from 'react-router-dom'

export const Auth = () => {
  return (
    <div className='w-full p-4'>
      <div className='grid sm:flex p-4 items-center justify-center text-center'>
        <Login />
        <Register />
      </div>
    </div>
  )
}



const Register = ()=>{
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  
  const onSubmit = async (e) =>{
    e.preventDefault()
    try {
    await axios.post('http://localhost:5000/auth/register', {
        username, 
        password})
        alert('User registered successfully')
    } catch (err) {
      console.err(err)
    }
    navigate('/auth')
  }

  return (
    <Form 
     username={username}
     setUsername={setUsername}
     password={password}
     setPassword={setPassword}
     label="Register"
     onSubmit={onSubmit}
    />
  )
}


const Login = ()=>{
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [_,setCookies] = useCookies(["access_token"])
  const navigate = useNavigate('/saved-crypto')

  const onSubmit = async (e) =>{
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username, 
        password})
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID)
        navigate("/saved-crypto")
    } catch (err) {
      console.err(err)
    }
  }

  return (
    <Form 
     username={username}
     setUsername={setUsername}
     password={password}
     setPassword={setPassword}
     label="Login"
     onSubmit={onSubmit}
    />
  )
}



const Form = ({username, setUsername,label,password,setPassword, onSubmit})=>{

  return(
      <form onSubmit={onSubmit}>
          <div className='grid p-8 mx-8 border rounded-md'>
            <h2 className='font-thin'>{label}</h2>
            <input 
            className='border mt-2 p-4 text-sm outline-none rounded-t-md' 
            placeholder='Username'
            type='text' 
            id='username'
            onChange={(e)=>setUsername(e.target.value)}
            value={username}
            />
             <input 
             className='border p-4 text-sm outline-none rounded-b-md' 
             placeholder='Password'
             type='password'
             id='password'
             onChange={(e)=>setPassword(e.target.value)}
             value={password}
              />
            <button type='submit' className='bg-indigo-500 text-white font-thin p-2 mt-4 hover:bg-indigo-300 rounded-md'>{label}</button>
          </div>
          </form>
  )
}