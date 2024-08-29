import CreateThread from "./(root)/_components/create-thread";
import ThreadList from "./(root)/_components/thread-list";
import Rootlayout from "./(root)/layout";



export default function Home() {
  return (
    <>
      <Rootlayout>
        
        <main>
          <h1>Online Forum</h1>
         <CreateThread />
         <ThreadList />
        </main>
      </Rootlayout>
    </>
  );
}