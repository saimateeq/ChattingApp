import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainBg from '../components/MainBg'
import PasswordCompnent from '../components/PasswordCompnent'
import ButtonPage from '../components/ButtonPage'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { child, get, ref, set } from 'firebase/database';
import { auth, database } from '../firebase/Firebase';

const SignUpPage = () => {
  const PasswordInp = useRef()
  const EmailInp = useRef()
  const NameInp = useRef()
  const UserNameInp = useRef()
  const navigate = useNavigate()
  const [ErrorState, setErrorState] = useState("")
  const FirebaseUpload = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, EmailInp.current.value, PasswordInp.current.value);
      const user = userCredential.user;
      await set(ref(database, 'users/' + UserNameInp.current.value), {
        Email: user.email,
        Uid: user.uid,
        Password: PasswordInp.current.value,
        Name: NameInp.current.value,
        Username: UserNameInp.current.value,
        Chats: []
      });
      navigate("/ChattingPage")
      localStorage.setItem("UserObj", JSON.stringify({
        Email: user.email,
        Uid: user.uid,
        Password: PasswordInp.current.value,
        Name: NameInp.current.value,
        Username: UserNameInp.current.value,
        Chats: []
      }))
    } catch (error) {
      console.log(error);
      setErrorState("Email Already in use")
    }
  }
  const AddUser = async (event) => {
    let username = UserNameInp.current.value
    let Password = PasswordInp.current.value
    event.preventDefault()
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${UserNameInp.current.value}`));
    const UserNameRegex = username.match(/^[a-zA-Z0-9-]+$/) !== null
    const PasswordRegex = Password.match(/^[A-Za-z0-9]+$/) !== null
    setErrorState(() => {
      if (snapshot.exists()) {
        return "Username already exists"
      } else if (!UserNameRegex) {
        return "Username can onlu cantain numbers , letters and '-' "
      } else if (UserNameInp.current.length >= 8) {
        return "Username must cantain at least 8 characters"
      } else if (!PasswordRegex) {
        return "Password can only cantain letters amd numbers "
      } else if (PasswordInp.current.length >= 8) {
        return "Password must cantain at least 8 characters"
      } else {
        FirebaseUpload()
        return ""
      }
    })
  }
  const PasswordInpFunc = () => {
    setErrorState("")
  }
  return (
    <div className='w-full h-screen bg-blur'>
      <MainBg></MainBg>
      <div className='sm:w-1/2 w-full absolute top-1/4 sm:left-1/4  bg-white rounded-xl p-3 shadow-custom'>
        <form className='flex flex-col items-center gap-3' onSubmit={(event) => { AddUser(event) }}>
          <h1 className='md:text-3xl text-xl font-bold'>Sign Up</h1>
          <h2 className='text-red-600 font-bold'>{ErrorState}</h2>
          <input type="text" placeholder='Enter Your Name' className='w-full border-2 text-lg border-gray-400 p-2 rounded-md' onInput={() => { setErrorState("") }} ref={NameInp} required />
          <input type="text" placeholder='Enter Your UserName' className='w-full border-2 text-lg border-gray-400 p-2 rounded-md' onInput={() => { setErrorState("") }} ref={UserNameInp} required />
          <input type="email" placeholder='Enter Your Email' className='w-full border-2 text-lg border-gray-400 p-2 rounded-md' onInput={() => { setErrorState("") }} ref={EmailInp} required />
          <PasswordCompnent PasswordInp={PasswordInp} OnInputFunc={PasswordInpFunc} />
          <p className='text-md text-gray-500 font-bold'>Already have an account ?<span onClick={() => { navigate("/LoginPage") }} className='text-blue-500 underline'>Login</span></p>
          <ButtonPage BtnName="Sign Up" />
        </form>
      </div>
    </div>
  )
}

export default SignUpPage
