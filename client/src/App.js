/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

import NavBar from './components/NavBar';
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribesUserPost from './components/screens/SubscribesUserPost';
import { initialState, reducer } from './reducers/userReducer';

import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({
        type: 'USER',
        payload: user,
      });
    } else {
      navigate('/signin');
    }
  }, []);

  return (
    <Routes>
      <Route exat path='/' element={<Home />}></Route>
      <Route path='/signin' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route exact path='/profile' element={<Profile />}></Route>
      <Route path='/create' element={<CreatePost />}></Route>
      <Route path='/profile/:userid' element={<UserProfile />}></Route>
      <Route path='/myfollowerpost' element={<SubscribesUserPost />}></Route>
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    M.AutoInit();
  });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
