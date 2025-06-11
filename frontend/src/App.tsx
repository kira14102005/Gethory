import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { Signin } from "./pages/Signin/Signin"
import { Register } from "./pages/Register/Register"
import { ValidateOTP } from "./pages/ValidateOTP/Validation"
import { Auth } from "./pages/Auth/Auth"
import { Profile } from "./pages/Profile/Profile"
import ProtectedRoute from "./routes/protected/ProtectedRoute.tsx"
function App() {

  return (
    <>
      <Routes>

        <Route element={<Home />} path="/" />
        <Route element={<Signin />} path="/signin" />
        <Route element={<Register />} path="/register" />
        <Route element={<ValidateOTP />} path="/submitotp" />
        <Route element={<Auth />} path="/auth" />
        <Route element={<Profile />} path="/profile" />
        <Route path="/rooms" element={<ProtectedRoute><div>Hello You r not auths</div> </ProtectedRoute>}>
        </Route>

      </Routes>

    </>
  )
}

export default App
