import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface Note {
  _id: string;
  title: string;
  body: string;
  userId: string;
}

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = (location.state as { userId?: string })?.userId;

  const [formData, setFormData] = useState({
    title: "",
    body: ""
  });

  const [notes, setNotes] = useState<Note[]>([]);

  if (!userId) {
    return <div>No user ID found. Please create a user first.</div>;
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // After creating a note, fetch notes:
        const res = await axios.get(`http://localhost:5000/app/notes/user/${userId}`);
        setNotes(res.data);

      } catch (err) {
        console.error("Failed to fetch notes", err);
      }
    };

    fetchNotes();
  }, [userId]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/app/notes", { ...formData, userId });
      alert("Note created!");
      setFormData({ title: "", body: "" });

      const res = await axios.get(`http://localhost:5000/app/notes/user/${userId}`);
      setNotes(res.data);

    } catch (err) {
      console.error(err);
      alert("Failed to create note");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Create Note</h2>
      <button onClick={() => navigate("/login")}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Note title"
          value={formData.title}
          onChange={handleChange}
          required
        /><br /><br />
        <textarea
          name="body"
          placeholder="Note body"
          value={formData.body}
          onChange={handleChange}
          required
          rows={4}
          style={{ width: "100%" }}
        /><br /><br />
        <button type="submit">Create Note</button>
      </form>

      <h3>Your Notes</h3>
      {notes.length === 0 && <p>No notes yet.</p>}
      <ul>
        {notes.map(note => (
          <li key={note._id} style={{ marginBottom: "1em" }}>
            <strong>{note.title}</strong><br />
            <p>{note.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
