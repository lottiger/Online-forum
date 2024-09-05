import CreateThread from "./(root)/_components/create-thread";
import ThreadList from "./(root)/_components/thread-list";
import Rootlayout from "./(root)/layout";



export default function Home() {
  return (
    <>
      <Rootlayout>
        
        <main>
         <CreateThread />
         <ThreadList />
        </main>
      </Rootlayout>
    </>
  );
}