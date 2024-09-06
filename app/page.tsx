import CreateThread from "./(root)/_components/create-thread";
import Navbar from "./(root)/_components/navbar";
import ThreadList from "./(root)/_components/thread-list";
import Rootlayout from "./(root)/layout";



export default function Home() {
  return (
    <>
      <Rootlayout>
      <div className="">
     
        <main className="">
          <CreateThread />
          <ThreadList />
        </main>
      </div>
      </Rootlayout>
    </>
  );
}