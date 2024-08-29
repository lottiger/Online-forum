import CreateThread from "./(root)/_components/create-thread";
import Rootlayout from "./(root)/layout";


export default function Home() {
  return (
    <>
      <Rootlayout>
        
        <main>
          <h1>Online Forum</h1>
         <CreateThread />
        </main>
      </Rootlayout>
    </>
  );
}