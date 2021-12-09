/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';

import { UserContext } from '../../App';

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState([]);
  const [image, setImage] = useState('');

  useEffect(() => {
    // console.log(state);
    fetch(`/mypost`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMyPosts(data.mypost));
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'insta_upl');
      data.append('cloud_name', 'testingkeys257');
      fetch('https://api.cloudinary.com/v1_1/testingkeys257/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch('/updatepic', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem('user', JSON.stringify({ ...state, pic: result.pic }));
              dispatch({ type: 'UPDATEPIC', payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
              alt='profile pitchure'
              src={state ? state.pic : 'loading'}
            />
          </div>
          <div>
            <h4>{state ? state.name : 'loading'}</h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>{`${myPosts.length} posts`}</h6>
              <h6>{state ? `${state.followers.length} followers` : 'loading'}</h6>
              <h6>{state ? `${state.following.length} following` : 'loading'}</h6>
            </div>
          </div>
        </div>
        <div className='file-field input-field' style={{ margin: '10px' }}>
          <div className='btn #64b5f6 blue darken-1'>
            <span>Update pic</span>
            <input type='file' onChange={(e) => updatePhoto(e.target.files[0])} />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>
      </div>

      <div className='gallery'>
        {myPosts.map((post) => {
          return <img key={post._id} className='item' alt={post.title} src={post.photo} />;
        })}
      </div>
    </div>
  );
};

export default Profile;
