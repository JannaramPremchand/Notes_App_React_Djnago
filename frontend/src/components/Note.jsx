import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Note.css";

function Note({ note, onDelete, onUpdate, index }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");
    const [isEditing, setIsEditing] = useState(false); // State to track editing mode

    // Array of colors
    const colors = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];

    // Calculate color index based on note index
    const colorIndex = index % colors.length;
    const noteColor = colors[colorIndex];
    return (
        <motion.div 
            className="note-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: noteColor }}
        >
            {isEditing ? (
                <form>
                    <input type="text" value={note.title} readOnly />
                    <textarea value={note.content} readOnly></textarea>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleCancel}>Cancel</button>
                </form>
            ) : (
                <>
                    <p className="note-title">{note.title}</p>
                    <p className="note-content">{note.content}</p>
                    <p className="note-date">{formattedDate}</p>
                    <button className="update-button" onClick={() => onUpdate(note.id)}>
                        Update
                    </button>
                    <button className="delete-button" onClick={() => onDelete(note.id)}>
                        Delete
                    </button>
                </>
            )}
        </motion.div>
    );
}

export default Note;
