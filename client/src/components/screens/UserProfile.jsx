/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';

import { UserContext } from '../../App';

const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  const [myPosts, setMyPosts] = useState([]);
  const [user, setUser] = useState('');
  const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMyPosts(data.posts);
        setUser(data.user);
      });
  }, []);

  const followUser = () => {
    fetch(`/follow`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        dispatch({
          type: 'UPDATE',
          payload: {
            ...data,
          },
        });
        localStorage.setItem('user', JSON.stringify({ ...data }));

        setUser((prevUser) => {
          return {
            ...prevUser,
            followers: [...prevUser.followers, data._id],
          };
        });

        setShowFollow(false);
      });
  };

  const unFollowUser = () => {
    fetch(`/unfollow`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        dispatch({
          type: 'UPDATE',
          payload: {
            ...data,
          },
        });
        localStorage.setItem('user', JSON.stringify({ ...data }));

        setUser((prevUser) => {
          const newFollower = prevUser.followers.filter((item) => item !== data._id);
          return {
            ...prevUser,
            followers: [...newFollower],
          };
        });

        setShowFollow(true);
      });
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
              src={user ? user.pic : 'loading'}
            />
          </div>
          <div>
            <h4>{user ? user.name : 'loading'}</h4>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>{`${1} posts`}</h6>
              <h6>{user ? `${user.followers.length} followers` : 'loading'}</h6>
              <h6>{user ? `${user.following.length} following` : 'loading'}</h6>
            </div>
            {showfollow ? (
              <button
                style={{
                  margin: '10px',
                }}
                className='btn waves-effect waves-light blue darken-1'
                onClick={followUser}
              >
                Follow
              </button>
            ) : (
              <button
                style={{
                  margin: '10px',
                }}
                className='btn waves-effect waves-light blue darken-1'
                onClick={unFollowUser}
              >
                Unfollow
              </button>
            )}
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

export default UserProfile;
