import './styles/NavBar.css'
import Temple from '../assets/temple.svg'

// React Imports
import { NavLink } from 'react-router-dom';

// Hooks
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

const NavBar = () => {
    const { logout, isPending } = useLogout()
    const { user } = useAuthContext()

    return (
        <nav className='navbar'>
            <ul>
                <li className="logo">
                    <img src={Temple} alt="dojo logo" />
                    <span>The Dojo</span>
                </li>

                {!user && (
                    <>
                        <li><NavLink to="/login">Login</NavLink></li>
                        <li><NavLink to="/signup">Signup</NavLink></li>
                    </>
                )}
                
                {user && (
                    <li>
                        {!isPending && <button className='btn' onClick={logout}>Logout</button>}
                        {isPending && <button className='btn' disabled>Logging out...</button>}
                    </li>
                )}
            </ul>
        </nav>
    );
}
 
export default NavBar;