import './App.css'
import MainCard from './components/MainCard'

function App() {

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Company Profile Generator</h1>
      </div>

      <MainCard />
    </div>
  )
}

export default App
