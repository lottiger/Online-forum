

import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ModeToggle } from '@/components/mode-toggle'
import Link from 'next/link'
import { VscCommentDiscussion } from "react-icons/vsc";
import { Input } from '@/components/ui/input';
import { BsSearch } from "react-icons/bs";


const Header = () => {
  return (
    <div className='py-2 border-b'>
      <div className='flex justify-between items-center px-4'>
        <Link href='/'>
          <h1 className='border-2 rounded-full p-3 bg-pink-400 dark:text-slate-950 border-slate-300'>
          <VscCommentDiscussion style={{ fontSize: '2rem' }} />
            </h1>
        </Link>
        <div className='flex gap-2 items-center'>
          <Input placeholder='Search'  />
          <BsSearch style={{ fontSize: '1.5rem' }}/>
        </div>
        <div className='flex items-center gap-2'>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;