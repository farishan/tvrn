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
      <main className="container mx-auto p-4">
        <div className="flex space-x-2">
          <img src={viteLogo} className="logo" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <h1 className="text-3xl font-bold my-8">
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
        <button className="rounded bg-black text-white py-3 w-48" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="text-sm my-4">
          Edit <code>app/src/App.tsx</code> and save to test HMR
        </p>

        <details>
          <summary className="text-xs">Current directory data from Neutralino</summary>
          <pre className="text-xs opacity-50">
            <code>
              {JSON.stringify(dir, null, 2)}
            </code>
          </pre>
        </details>
      </main>
    </>
  )
}

export default App
