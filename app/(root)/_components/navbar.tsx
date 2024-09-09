import React from 'react'
import Link from 'next/link' // Om du använder Next.js

const Navbar = () => {
  return (
    <aside className='p-4'>
      <nav>
        <ul className='space-y-2'>
          <li>
            <Link href='/' className='hover:underline'>
              Hem
            </Link>
          </li>
          <li>
            <Link href='/profil' className='hover:underline'>
              Profil
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Navbar