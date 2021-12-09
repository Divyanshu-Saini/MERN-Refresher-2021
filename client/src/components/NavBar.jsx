/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../App';

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const LogOut = () => {
    console.log('Logging out');
    localStorage.clear();
    dispatch({ type: 'CLEAR' });
    navigate('/signin');
  };

  const renderList = () => {
    if (state) {
      return [
        <>
          <li key='profile'>
            <Link to='/profile'>Profile</Link>
          </li>
          <li key='create'>
            <Link to='/create'>Add Post</Link>
          </li>
          <li key='myfollowerpost'>
            <Link to='/myfollowerpost'>My following Posts</Link>
          </li>
          <li key='signout'>
            <button className='btn waves-effect waves-light red' onClick={LogOut}>
              Logout
            </button>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li key='signin'>
            <Link to='/signin'>Login</Link>
          </li>
          <li key='signup'>
            <Link to='/signup'>SignUp</Link>
          </li>
        </>,
      ];
    }
  };

  return (
    <nav>
      <div className='nav-wrapper white'>
        <Link to={state ? '/' : '/signin'} className='brand-logo left'>
          Instagram
        </Link>
        <ul id='nav-mobile' className='right'>
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
