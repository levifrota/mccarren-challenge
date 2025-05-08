import './App.css'
import MainCard from './components/MainCard'

function App() {

  return (
    <div className="min-h-screen bg-background p-6">
      <h3 className='flex items-center justify-center text-xl mb-4'>
        <img
          src="https://cdn.prod.website-files.com/6765d3a3eb10195eb9e2b55a/67ddb9ca2cc764087bfa21b7_logo-256x256.png"
          alt="McCarren"
          className='w-10 pr-2'
        />
         McCarren
        </h3>
      <div className="mx-auto">
        <h1 className="font-bold mb-6 text-center">
          McCarren Profile Generator
          </h1>
      </div>

      <MainCard />
    </div>
  )
}

export default App
