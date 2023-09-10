import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) => { 
    const auth = useContext(AuthContext);

    const navigate = useNavigate()

    const logoutHandler = () => { 
        auth.logout();
        navigate('/');

    };

    return (
        <ul className='nav-links'>
            <li>
                <NavLink to="/">All Users</NavLink>
            </li>

            {auth.isLoggedIn && (
                <li>
                    <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
                </li>
            )}

            {auth.isLoggedIn && (
                <li>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>
            )}
            
            {!auth.isLoggedIn && (
                <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>
            )}
            {auth.isLoggedIn && (
                <li>
                    <button onClick={logoutHandler}>Log out</button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;