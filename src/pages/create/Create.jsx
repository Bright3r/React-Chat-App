import './Create.css'

// React imports
import { useState, useEffect } from 'react';
import Select from 'react-select'
import { useNavigate } from 'react-router-dom';

// Firebase
import { Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Hooks
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
]



const Create = () => {
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [category, setCategory] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [formError, setFormError] = useState(null)

    const { documents } = useCollection('users')
    const [users, setUsers] = useState([])
    const { user } = useAuthContext()
    const { addDocument, response } = useFirestore('projects')
    const navigate = useNavigate()

    useEffect(() => {
        if (documents) {
            const options = documents.map(user => {
                return { value: user, label: user.displayName }
            })
            setUsers(options)
        }
    }, [documents])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        if (!category) {
            setFormError('Please select a project category')
            return
        }
        if (assignedUsers.length < 1) {
            setFormError('Please assign the project to at least 1 user')
            return
        }

        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid
        }

        const assignedUsersList = assignedUsers.map((u) => {
            return {
                displayName: u.value.displayName,
                photoURL: u.value.photoURL,
                id: u.value.id
            }
        })

        const project = {
            name,
            details,
            category: category.value,
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            comments: [],
            createdBy,
            assignedUsersList
        }

        await addDocument(project)
        if (!response.error) {
            navigate('/')
        }
        
    }

    return (
        <div className="create-form">
            <h2 className="page-title">Create a new project</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Project Name:</span>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        required
                    />
                </label>

                <label>
                    <span>Project Details:</span>
                    <textarea
                        type="text"
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}
                        required
                    />
                </label>

                <label>
                    <span>Due Date:</span>
                    <input
                        type="date"
                        onChange={(e) => setDueDate(e.target.value)}
                        value={dueDate}
                        required
                    />
                </label>

                <label>
                    <span>Project Category:</span>
                    <Select
                        options={categories}
                        onChange={(option) => setCategory(option)}
                    />
                </label>

                <label>
                    <span>Assign to:</span>
                    <Select
                        options={users}
                        onChange={(option) => setAssignedUsers(option)}
                        isMulti
                    />
                </label>

                <button className="btn">Add Project</button>

                {formError && <p className='error'>{formError}</p>}
            </form>
        </div>
    );
}
 
export default Create;