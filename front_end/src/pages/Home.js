import { useEffect, useState } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

// components
import WorkoutDetails from "../components/WorkoutDetails"
import WorkoutForm from "../components/WorkoutForm"

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`)
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json })
      }
    }

    fetchWorkouts()
  }, [dispatch])

  const filteredWorkouts = Array.isArray(workouts) ? workouts.filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  return (
    <div className="home">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search workouts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="workouts">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <WorkoutDetails workout={workout} key={workout._id} />
          ))
        ) : (
          <p>No workouts found</p>
        )}
      </div>

      <WorkoutForm />
    </div>
  )
}

export default Home
