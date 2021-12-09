/* eslint-disable no-useless-escape */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

import { UserContext } from '../../App';

const Login = () => {
  const navigate = useNavigate();

  const { dispatch } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const UserLogin = async () => {
    try {
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: 'invalid email', classes: 'red darken-3' });
        return;
      }
      const res = await fetch(`/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).catch((err) => {
        throw new Error(err);
      });

      const data = await res.json();
      console.info('User login', data, res);
      if (res.status !== 200) {
        M.toast({
          html: data.error,
          classes: 'red darken-2',
        });
      } else {
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({
          type: 'USER',
          payload: data.user,
        });
        M.toast({
          html: `${data.user.name} logged in successfull`,
          classes: 'green darken-1',
        });
        navigate('/');
      }
    } catch (error) {
      console.log('Some error occured while Logging in', error);
    }
  };

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='btn waves-effect waves-light blue darken-1' onClick={UserLogin}>
          Login
        </button>
        <h5>
          <Link to='/signup'>Don't have a account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Login;
