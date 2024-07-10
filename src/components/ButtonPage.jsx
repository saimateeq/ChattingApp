import React from 'react'

const ButtonPage = ({BtnName}) => {
  return (
    <button className='py-2 px-4 border-gray-600 border-2 bg-blue-600 text-white text-lg font-bold rounded-xl' type='submit'>{BtnName}</button>
  )
}

export default ButtonPage
