
import { useState } from 'react';
import GoogleAuth from './GoogleAuth';
import FacebookAuth from './FacebookAuth';

function App() {
  const [type, setType]  = useState<"fb" | "gg">("gg")
  return (
    <>

      <span className='flex gap-5'>
        <button onClick={() => setType("fb")} className='px-3 py-2 rounded-md bg-blue-500 text-white'>
          Facebook
        </button>
        <button  onClick={() => setType("gg")} className='px-3 py-2 rounded-md bg-blue-500 text-white'>
          Google
        </button>
      </span>
     {type === "gg" ?  <GoogleAuth />: <FacebookAuth />}
    </>
  );
}
export default App;
