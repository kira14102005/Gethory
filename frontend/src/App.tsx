import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home/Home"
import { Signin } from "./pages/Signin/Signin"
import { Register } from "./pages/Register/Register"
import { ValidateOTP } from "./pages/ValidateOTP/Validation"
import { Auth } from "./pages/Auth/Auth"
import { Profile } from "./pages/Profile/Profile"
import ProtectedRoute from "./routes/protected/ProtectedRoute.tsx"
import SemiProtected from "./routes/protected/SemiProtected.tsx"
import Room from "./pages/Room/Room.tsx"
import StartMeet from "./pages/StartMeet/StartMeet.tsx"
function App() {

  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Signin />} path="/signin" />
        <Route element={<Register />} path="/register" />
        <Route element={<ValidateOTP />} path="/submitotp" />
        <Route element={
          <SemiProtected>
            <Auth />
          </SemiProtected>} path="/auth" />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>}>
        </Route>
        <Route path="/room" element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>}>
        </Route>
        <Route path="/createroom" element={
          <ProtectedRoute>
            <StartMeet />
          </ProtectedRoute>}>
        </Route>
      </Routes>

    </>
  )
}

export default App
