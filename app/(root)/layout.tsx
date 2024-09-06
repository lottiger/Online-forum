import React, { ReactNode } from 'react';
import Header from './_components/header';
import Navbar from './_components/navbar';




interface RootlayoutProps {
  children: ReactNode;
}

function Rootlayout({ children }: RootlayoutProps) {
  return (
    <>
    <Header />
    <div className='flex min-h-screen'>
     
     <aside className="w-1/6 border-r">
          <Navbar />
        </aside>
      <main className='flex-1 p-4'>
        {children}
      </main>
    </div>
    </>
  );
}

export default Rootlayout;
