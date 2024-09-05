import CreateThread from "./(root)/_components/create-thread";
import Navbar from "./(root)/_components/navbar";
import ThreadList from "./(root)/_components/thread-list";
import Rootlayout from "./(root)/layout";



export default function Home() {
  return (
    <>
      <Rootlayout>
      <div className="flex min-h-screen">
        <aside className="w-1/6 border-r">
          <Navbar />
        </aside>
        <main className="flex-1 p-4">
          <CreateThread />
          <ThreadList />
        </main>
      </div>
      </Rootlayout>
    </>
  );
}