import React from 'react'
import Link from 'next/link' // Om du använder Next.js

const Navbar = () => {
  return (
    <aside className='flex items-center justify-center mt-14 '>
      <nav>
        <ul className='space-y-3'>
          <li>
            <Link href='/' className='hover:underline'>
              Home
            </Link>
          </li>
          <li>
            <Link href='/' className='hover:underline'>
              Profile
            </Link>
          </li>
          <li>
            <Link href='/' className='hover:underline'>
              Category
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Navbar