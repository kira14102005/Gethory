import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
function App() {

  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Home />} path="/" />


      </Routes>

    </>
  )
}

export default App
