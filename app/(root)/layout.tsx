import React, { ReactNode } from 'react';
import Header from './_components/header';




interface RootlayoutProps {
  children: ReactNode;
}

function Rootlayout({ children }: RootlayoutProps) {
  return (
    <div className=''>
     <Header />
      <main className='mx-4'>
        {children}
      </main>
    </div>
  );
}

export default Rootlayout;
