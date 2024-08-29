

import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ModeToggle } from '@/components/mode-toggle'

const Header = () => {
  return (
    <>
    <div className='mt-5'>
      <div className='flex justify-end px-4 items-center h-full gap-2'>
       
      <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
          </SignedIn>
          <ModeToggle />
          </div>
    </div>
    </>
  )
}

export default Header
  