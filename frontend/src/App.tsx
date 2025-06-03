import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { Navbar } from "./components/shared/Navigation"
import { Signin } from "./pages/Signin/Signin"
function App() {

  return (
    <>
      <Routes>

          <Route element={<Home />} path="/" />
          <Route element={<Signin />} path="/signin" />

      </Routes>

    </>
  )
}

export default App
