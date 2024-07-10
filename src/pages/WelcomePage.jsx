import React, { useEffect, useState } from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'

const WelcomePage = () => {
    const [ChattingAppH,setChattingAppH] = useState("")
    const [HeadingAniClass,setHeadingAniClass] = useState("")
    const [BtnAni,setBtnAni] = useState("")
    const navigate = useNavigate()
    const MainH = "Chatting App"
    setTimeout(() => {
        setHeadingAniClass("headingAni")
    }, 3000)
    setTimeout(() => {
        setBtnAni("BtnsShow")
    }, 3000);
    const HeadingAniFunc = () => {
        let words = 0
        const HeadingAnii = () => {
            if (ChattingAppH !== MainH) {
                let text = MainH.substring(0, words)
                setChattingAppH(text)
                words++
            } else {
                clearInterval(interval);
            }
        }
        const interval = setInterval(HeadingAnii, 200)
    }
    useEffect(() => {
        HeadingAniFunc()
    }, [])
    return (
        <div className='w-full bg-green-400 h-screen flex flexx-col items-start'>
            <div className={`w-full h-1/6 absolute text-center top5-12 flex justify-center ${HeadingAniClass}`}>
                <h1 className="font-bold MainH w-fit z-20">{ChattingAppH}</h1>
            </div>
            <div className=" w-full flex-col m-auto text-white sm:text-2xl text-lg items-center font-bold gap-7 flex overflow-hidden ">
                <button className={`w-1/3 bg-blue-600 rounded-xl p-2 translate-y-96 justify-center ${BtnAni}`}  onClick={() => { navigate("/LoginPage") }}>Login</button>
                <button className={`w-1/3 bg-blue-600 rounded-xl p-2 translate-y-96 justify-center ${BtnAni}`} onClick={() => { navigate("/SignUpPage") }}>Sign Up</button>
            </div>

        </div>
    )
}

export default WelcomePage
