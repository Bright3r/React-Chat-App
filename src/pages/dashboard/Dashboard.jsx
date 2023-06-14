import './Dashboard.css'

// React Imports
import { useState } from 'react';

// Hooks
import { useCollection } from '../../hooks/useCollection';

// Components
import ProjectList from '../../components/ProjectList';
import ProjectFilter from '../../components/ProjectFilter';
import { useAuthContext } from '../../hooks/useAuthContext';

const DashBoard = () => {
    const [currentFilter, setCurrentFilter] = useState('all')
    const { documents, error } = useCollection('projects')
    const { user } = useAuthContext()

    const changeFilter = (newFilter) => {
        setCurrentFilter(newFilter)
    }

    const projects = documents ? documents.filter((doc) => {
        switch (currentFilter) {
            case 'all':
                return true
            case 'mine':
                let assignedToMe = false
                doc.assignedUsersList.forEach((u) => {
                    if (user.uid === u.id) {
                        assignedToMe = true
                    }
                })
                return assignedToMe
            case 'development':
            case 'design':
            case 'sales':
            case 'marketing':
                 return doc.category === currentFilter
            default:
                return true
        }
    }) : null

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            {error && <p className='error'>{error}</p>}
            {documents && 
                <ProjectFilter 
                    currentFilter={currentFilter} 
                    changeFilter={changeFilter}
                />
            }
            {projects && <ProjectList projects={projects} />}
        </div>
    );
}
 
export default DashBoard;