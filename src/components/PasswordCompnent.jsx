import React, { useRef, useState } from 'react'

const PasswordCompnent = ({PasswordInp , OnInputFunc}) => {
    const [PasscodeShow , setPasscodeShow] = useState(false)
    const [PasscodeIconClass , setPasscodeIconClass] = useState("bi bi-eye-slash-fill")
    const PasscodeShowfunc = (event) => {
        event.preventDefault()
        if (!PasscodeShow) {
            PasswordInp.current.type = "text"
            setPasscodeShow(true)
            setPasscodeIconClass("bi bi-eye-fill")
        } else {
            PasswordInp.current.type = "password"
            setPasscodeShow(false)
            setPasscodeIconClass("bi bi-eye-slash-fill")
        }
    }
    return (
        <div className='w-full md:h-12 flex flex-row justify-center'>
            <input type="password" placeholder='Enter Passcode' className='w-10/12 border-gray-400 border-2 p-2 md:text-lg text-md rounded-l-lg' onInput={(event) => { OnInputFunc(event) }} ref={PasswordInp} required />
            <button className='w-1/6 p-2 flex justify-center items-center border-gray-400 border-2 md:text-xl text-lg rounded-r-lg' onClick={(event) => { PasscodeShowfunc(event) }}>
                <i className={PasscodeIconClass}></i>
            </button>
        </div>
    )
}
export default PasswordCompnent
