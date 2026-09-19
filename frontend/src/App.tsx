import { Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

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
import AnimatedPage from "./components/shared/AnimatedPage.tsx";
function App() {
  const location = useLocation();

  return (
    <>
      <AppInitializer>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={
              <AnimatedPage><Home /></AnimatedPage>
            } path="/" />
            {/* VerifiedGuard routes*/}
            <Route element={
              <AnimatedPage><VerificationGuard>
                <VerificationStatusPage />
              </VerificationGuard></AnimatedPage>
            } path="/verify-status" />
            <Route element={
              <AnimatedPage><VerificationGuard><ValidateOTP /></VerificationGuard></AnimatedPage>} path="/submitotp" />
            {/* Guest Routes: Use SemiProtected to redirect logged-in users away */}

            <Route element={<AnimatedPage><SemiProtected><Signin /></SemiProtected></AnimatedPage>} path="/signin" />
            <Route element={<AnimatedPage><SemiProtected><Register /></SemiProtected></AnimatedPage>} path="/register" />



            {/* Onboarding Route: Must be logged in, but profile is incomplete.
          */}
            <Route element={
              <AnimatedPage><OnboardingRoute>
                <Auth />
              </OnboardingRoute></AnimatedPage>
            } path="/auth" />

            {/* Fully Protected Routes: Require AUTHENTICATED AND PROFILE COMPLETE */}
            <Route path="/profile" element={
              <AnimatedPage><ProtectedRoute>
                <Profile />
              </ProtectedRoute>
              </AnimatedPage>}>
            </Route>
            <Route path="/rooms" element={
              <AnimatedPage><ProtectedRoute>
                <Room />
              </ProtectedRoute>
              </AnimatedPage>}>
            </Route>
            <Route path="/newroom/:id" element={<AnimatedPage><Newroom /></AnimatedPage>}>
            </Route>
          </Routes>
        </AnimatePresence>
      </AppInitializer>
    </>
  )
}

export default App
