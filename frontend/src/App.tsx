import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { Signin } from "./pages/Signin/Signin"
import { Register } from "./pages/Register/Register"
import { ValidateOTP } from "./pages/ValidateOTP/Validation"
function App() {

  return (
    <>
      <Routes>

          <Route element={<Home />} path="/" />
          <Route element={<Signin />} path="/signin" />
          <Route element={<Register />} path="/register" />
          <Route element={<ValidateOTP />} path="/submitotp" />

      </Routes>

    </>
  )
}

export default App
