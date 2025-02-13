import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { user } = useAuthContext()
  const { dispatch } = useWorkoutsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(workout.title);
  const [reps, setReps] = useState(workout.reps);
  const [load, setLoad] = useState(workout.load);

  // Handle delete
  const handleClick = async () => {
    if (!user) {
      return
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
        return;
    }

    const updatedWorkout = { title, reps, load };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedWorkout),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });

    const json = await response.json();

    if (response.ok) {
        dispatch({ type: "UPDATE_WORKOUT", payload: json });
        setIsEditing(false);
    }
};
  
  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
          <input
            type="number"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Number of reps: </strong>
            {workout.reps}
          </p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <div className="actions">
            <span className="material-symbols-outlined" onClick={handleClick}>
              delete
            </span>
            <span className="material-symbols-outlined" onClick={() => setIsEditing(true)}>
              edit
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
