

// React Imports
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// Firebase
import { Timestamp } from "firebase/firestore";

// Components
import Avatar from "./Avatar";

// Hooks
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";

const ProjectComments = ({ project }) => {
    const [newComment, setNewComment] = useState('')
    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore('projects')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const commentToAdd = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: newComment,
            createdAt: Timestamp.fromDate(new Date()),
            id: uuidv4()
        }
        
        await updateDocument(project.id, {
            comments: [...project.comments, commentToAdd]
        })

        if (!response.error) {
            setNewComment('')
        }
    }

    return (
        <div className="project-comments">
            <h4>Project Comments</h4>

            <ul>
                {project.comments.length > 0 && project.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <form className="add-comment" onSubmit={handleSubmit}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                        required
                    />
                </label>

                <button className="btn">Add Comment</button>

            </form>

        </div>
    );
}
 
export default ProjectComments;