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
import AppInitializer from "./components/shared/AppInitializer.tsx"
import OnboardingRoute from "./routes/protected/OnboardingRoute.tsx"
import VerificationGuard from "./routes/protected/VerificationGuard.tsx"
import VerificationStatusPage from "./pages/VerifyStatus/VerificationStatus.tsx"
import Newroom from "./pages/NewRoom/Newroom.tsx"
function App() {

  return (
    <>
      <AppInitializer>
        <Routes>
          <Route element={<Home />} path="/" />
          {/* VerifiedGuard routes*/}
          <Route element={
            <VerificationGuard>
              <VerificationStatusPage />
            </VerificationGuard>
          } path="/verify-status" />
          <Route element={<VerificationGuard><ValidateOTP /></VerificationGuard>} path="/submitotp" />
          {/* Guest Routes: Use SemiProtected to redirect logged-in users away */}

          <Route element={<SemiProtected><Signin /></SemiProtected>} path="/signin" />
          <Route element={<SemiProtected><Register /></SemiProtected>} path="/register" />



          {/* Onboarding Route: Must be logged in, but profile is incomplete.
          */}
          <Route element={
            <OnboardingRoute>
              <Auth />
            </OnboardingRoute>
          } path="/auth" />

          {/* Fully Protected Routes: Require AUTHENTICATED AND PROFILE COMPLETE */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>}>
          </Route>
          <Route path="/rooms" element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>}>
          </Route>
          <Route path="/newroom/:id" element = {<Newroom/>}>
          </Route>
        </Routes>
      </AppInitializer>
    </>
  )
}

export default App
