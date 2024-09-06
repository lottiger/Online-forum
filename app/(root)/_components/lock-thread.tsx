'use client'

import React from 'react'
import { CiLock } from "react-icons/ci"
import { CiUnlock } from "react-icons/ci"

const LockThread = () => {
  return (
    <div className='flex justify-end'>
      <CiLock style={{ fontSize: '1.7rem' }} /> 
      <CiUnlock style={{ fontSize: '1.7rem' }} /> 
    </div>
  )
}

export default LockThread