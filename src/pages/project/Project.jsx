import './Project.css'

// React Imports
import { useParams } from 'react-router-dom';

// Components
import ProjectSummary from '../../components/ProjectSummary'

// Hooks
import { useDocument } from '../../hooks/useDocument';
import ProjectComments from '../../components/ProjectComments';

const Project = () => {
    const { id } = useParams()
    const { document, error } = useDocument('projects', id)

    if (error) {
        return <div className="error">{error}</div>
    }
    if (!document) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div className='project-details'>
            <ProjectSummary project={document} />
            <ProjectComments project={document}/>
        </div>
    );
}
 
export default Project;