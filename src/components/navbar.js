import React from 'react'
import {Link} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";

const style = {
    button: `bg-indigo-500 text-white rounded-lg text-center justify-center p-2 mx-2 hover:bg-indigo-300`,
    logo: `font-bold text-indigo-500 mb-3 md:mb-0`
}

const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const logout = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/auth")
    }

  return (
    <header className='w-full md:flex text-center justify-center p-6 gap-6 border-b font-thin justify-between'>
    <div className={style.logo}>CryptoTracker</div>
    <div>
    <Link to="/" className='p-2 hover:text-indigo-500'>Home</Link>
        {!cookies.access_token ? (<Link to="auth" className={style.button}>Login/Register</Link>)
        :
        (   <>
            <Link to="saved-crypto" className='p-2 hover:text-indigo-500'>Favorites</Link>
            <Link to="/" className={style.button} onClick={logout}>Logout</Link>
         </>)}
    </div>
    </header>
  )
}

export default Navbar