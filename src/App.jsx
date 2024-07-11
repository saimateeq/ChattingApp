import React from 'react'
import  { HashRouter, Route, Routes } from "react-router-dom"
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MainBg from './components/MainBg'
import ChattingPage from './pages/ChattingPage'

const App = () => {
  return (
    <HashRouter>
    <Routes >
      <Route path='/' Component={WelcomePage}/>
      <Route path='/LoginPage' Component={LoginPage}/>
      <Route path='/SignUpPage' Component={SignUpPage}/>
      <Route path='/MainBg' Component={MainBg}/>
      <Route path='/ChattingPage' Component={ChattingPage}/>
      </Routes>
    </HashRouter>
  )
}

export default App
