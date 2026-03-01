import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Focus from './pages/Focus'
import Pickups from './pages/Pickups'
import AverageUse from './pages/AverageUse'
import WalkingUse from './pages/WalkingUse'
import StationaryLife from './pages/StationaryLife'
import UnlockAdvance from './pages/UnlockAdvance'
import ContinuousUse from './pages/ContinuousUse'
import TokenShop from './pages/TokenShop'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/focus" element={<Focus />} />
      <Route path="/pickups" element={<Pickups />} />
      <Route path="/average-use" element={<AverageUse />} />
      <Route path="/walking-use" element={<WalkingUse />} />
      <Route path="/stationary-life" element={<StationaryLife />} />
      <Route path="/unlock-advance" element={<UnlockAdvance />} />
      <Route path="/continuous-use" element={<ContinuousUse />} />
      <Route path="/token-shop" element={<TokenShop />} />
      <Route path="/tienda" element={<TokenShop />} />
    </Routes>
  )
}

export default App
