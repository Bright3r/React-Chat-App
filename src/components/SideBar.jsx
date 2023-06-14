import './styles/SideBar.css'
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'

// React Imports
import { NavLink } from 'react-router-dom'

// Components
import Avatar from './Avatar'

// Hooks
import { useAuthContext } from '../hooks/useAuthContext'

const SideBar = () => {
    const { user } = useAuthContext()

    return (
        <div className='sidebar'>
            <div className="sidebar-content">
                <div className="user">
                    <Avatar src={user.photoURL} />
                    <p>Hi, {user.displayName}</p>
                </div>

                <nav className="links">
                    <ul>
                        <li>
                            <NavLink to="/">
                                <img src={DashboardIcon} alt="dashboard icon" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/create">
                                <img src={AddIcon} alt="add icon" />
                                <span>New Project</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
 
export default SideBar;