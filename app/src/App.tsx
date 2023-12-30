import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { filesystem } from "@neutralinojs/lib"

function App() {
  const [count, setCount] = useState(0)
  const [dir, setDir] = useState<null | Array<{ entry: string, type: string }>>(null)

  // Log current directory or error after component is mounted
  useEffect(() => {
    filesystem.readDirectory('./').then((data) => {
      console.log(data)
      setDir(data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <>
      <img src={viteLogo} className="logo" alt="Vite logo" />
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1 className="text-3xl font-bold underline">
        <a href="https://neutralino.js.org">
          Neutralino
        </a> + <a href="https://vitejs.dev">
          Vite
        </a> + <a href="https://react.dev">
          React
        </a> + <a href="https://tailwindcss.com">
          Tailwind
        </a>
      </h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>app/src/App.tsx</code> and save to test HMR
        </p>
        <pre>
          <code>
            {JSON.stringify(dir, null, 2)}
          </code>
        </pre>
      </div>
    </>
  )
}

export default App
