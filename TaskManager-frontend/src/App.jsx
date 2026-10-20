import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch tasks");
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    const addTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        const taskTitle = title.trim();
        const taskDescription = description.trim();
        const temporaryTask = {
            _id: "temp-" + Date.now(),
            title: taskTitle,
            description: taskDescription,
            completed: false
        };
        setTasks((previous) => [...previous, temporaryTask]);
        setTitle("");
        setDescription("");

        try {
            setLoading(true);
            setError("");
            setMessage("");
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: taskTitle, description: taskDescription, completed: false })
            });
            if (!response.ok) throw new Error("Failed to create task");
            const data = await response.json();
            setTasks((previous) => previous.map((task) => task._id === temporaryTask._id ? data.task : task));
            setMessage("Task created successfully");
        } catch (error) {
            setTasks((previous) => previous.filter((task) => task._id !== temporaryTask._id));
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            setLoading(true);
            setError("");
            setMessage("");
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete task");
            setTasks((previous) => previous.filter((task) => task._id !== id));
            setMessage("Task deleted successfully");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (task) => {
        const newTitle = window.prompt("Enter new task title:", task.title);
        if (!newTitle || !newTitle.trim()) return;
        const newDescription = window.prompt("Enter new description:", task.description || "");
        if (newDescription === null) return;
        const completed = task.completed || window.confirm("Mark this task as completed?\nSelect Cancel to keep it pending.");

        try {
            setLoading(true);
            setError("");
            setMessage("");
            const response = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle.trim(), description: newDescription.trim(), completed })
            });
            if (!response.ok) throw new Error("Failed to update task");
            const data = await response.json();
            setTasks((previous) => previous.map((item) => item._id === task._id ? data.task : item));
            setMessage("Task updated successfully");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Task Manager</h1>
            <form onSubmit={addTask}>
                <input aria-label="Task title" type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input aria-label="Task description" type="text" placeholder="Task description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit" disabled={loading}>Add Task</button>
            </form>
            <h2>Tasks</h2>
            {loading && <p>Loading tasks...</p>}
            {error && <p className="error" role="alert">{error}</p>}
            {message && <p className="success" role="status">{message}</p>}
            {!loading && !error && tasks.length === 0 && <p>No tasks yet. Add one above.</p>}
            {tasks.map((task) => (
                <div className="task" key={task._id}>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                    <button onClick={() => updateTask(task)} disabled={loading}>Update</button>
                    <button onClick={() => deleteTask(task._id)} disabled={loading}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default App;
