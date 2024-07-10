import React, { useRef, useState } from 'react'
import MainBg from '../components/MainBg'
import "../App.css"
import PasswordCompnent from '../components/PasswordCompnent'
import ButtonPage from '../components/ButtonPage'
import { useNavigate } from 'react-router-dom'
import { child, get, ref } from 'firebase/database'
import { setUserObj } from '../reducers/UserDataReducer'
import { database } from '../firebase/Firebase'
import { useDispatch } from 'react-redux'


const LoginPage = () => {
  const [ErrorState, setErrorState] = useState("")
  const [UserFound, setUserFound] = useState(false)
  const [PasswordMatch, setPasswordMatch] = useState(false)
  const [User, setUser] = useState({})
  const PasswordInp = useRef()
  const EmailInp = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const LoginFunc = async (event) => {
    event.preventDefault();
    setErrorState("")
    setUserFound(false)
    setPasswordMatch(false)
    get(child(ref(database), "users")).then((snapshot) => {
      if (snapshot.exists()) {
        let Users = snapshot.val()
        Object.keys(Users).forEach(key => {
          let Email = Users[key].Email
          let Password = Users[key].Password
          if (Email === EmailInp.current.value) {
            setUserFound(true)
            if (Password === PasswordInp.current.value) {
              setPasswordMatch(true)
              setUser(Users[key])
            }
          }
        })
      }
    })
  }
  const SubmitFunc = (event) => {
    event.preventDefault()
    if (UserFound && PasswordMatch) {
      dispatch(setUserObj(User))
      localStorage.setItem("UserObj" , JSON.stringify(User))
      navigate("/ChattingPage")
    } else {
      setErrorState(() => {
        if (!UserFound) { return "User Not Found" }
        else { return "Incorrect Password" }
      })
    }
  }
return (
  <div className='w-full h-screen bg-blur'>
    <MainBg></MainBg>
    <div className='sm:w-1/2 w-full absolute top-1/4 sm:left-1/4  bg-white rounded-xl p-3 shadow-custom'>
      <form className='flex flex-col items-center gap-3' onSubmit={(event) => { SubmitFunc(event) }}>
        <h1 className='md:text-3xl text-xl font-bold'>Login</h1>
        <h2 className='text-red-600 font-bold'>{ErrorState}</h2>
        <input type="email" placeholder='Enter Your Email' className='w-full border-2 text-lg border-gray-400 p-2 rounded-md' ref={EmailInp} required onInput={(event) => (LoginFunc(event))} />
        <PasswordCompnent PasswordInp={PasswordInp} setErrorState={setErrorState} OnInputFunc={LoginFunc} />
        <p className='text-md text-gray-500 font-bold'>Don't have an account ? <span onClick={() => { navigate("/SignUpPage") }} className='text-blue-500 underline'>SignUp</span></p>
        <ButtonPage BtnName="Login" />
      </form>
    </div>
  </div>
)
}

export default LoginPage
