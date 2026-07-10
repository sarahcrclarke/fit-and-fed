import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { Today } from './pages/Today'
import { Workouts } from './pages/Workouts'
import { BodyFocus } from './pages/BodyFocus'
import { Meals } from './pages/Meals'
import { MealPlanner } from './pages/MealPlanner'
import { Progress } from './pages/Progress'
import { ProfileSettings } from './pages/ProfileSettings'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Today />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="body-focus" element={<BodyFocus />} />
        <Route path="meals" element={<Meals />} />
        <Route path="meal-planner" element={<MealPlanner />} />
        <Route path="progress" element={<Progress />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  )
}

export default App
