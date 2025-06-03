import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { Navbar } from "./components/shared/Navigation"
function App() {

  return (
    <>
    <Navbar></Navbar>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Home />} path="/" />


      </Routes>

    </>
  )
}

export default App
