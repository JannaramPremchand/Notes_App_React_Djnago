import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import logo from "../assets/logo.png"
function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status != 204) alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const editNote = (noteId) => {
        const noteToEdit = notes.find((note) => note.id === noteId);
        setContent(noteToEdit.content);
        setTitle(noteToEdit.title);
        setEditingNoteId(noteId);
    };
    const createNote = (e) => {
        e.preventDefault();
        const apiMethod = editingNoteId ? api.put : api.post;
        const url = editingNoteId ? `/api/notes/update/${editingNoteId}/` : "/api/notes/";
        apiMethod(url, { content, title })
            .then((res) => {
                if (res.status === 201 || res.status === 200) {
                    setContent("");
                    setTitle("");
                    setEditingNoteId(null);
                } else {
                    alert("Failed to create/update note.");
                }
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const logout = () => {
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', gap: '10px'}}>
            <img src={logo} alt="logo" style={{ height: '4rem', width: '10rem' }} />
            <button className="logout" onClick={logout}>Logout</button>
        </div>
        <div className="home">
            <div className="createNotes">
                <h2>Create a Note</h2>
                <form onSubmit={createNote}>
                    <label htmlFor="title">Title:</label>
                    <br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <label htmlFor="content">Content:</label>
                    <br />
                    <textarea
                        id="content"
                        name="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <br />
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
            <div className="noteListContainer">
            <div className="noteList">
                <h2>Notes</h2>
                {notes.map((note, index) => (
                    <Note note={note} onDelete={deleteNote} onUpdate={editNote} key={note.id} index={index} />
                ))}
            </div>
            </div>
        </div>
        </>
    );
}

export default Home;