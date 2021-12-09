import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../../App';

const SubscribesUserPost = () => {
  const { state } = useContext(UserContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/getsubpost`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data.posts))
      .catch((err) => console.error('Error occured while fetching data', err));
  }, []);

  const likePost = (id) => {
    console.log('Like');
    fetch(`/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((ndata) => {
        const newData = data.map((item) => {
          if (item._id === ndata._id) {
            return ndata;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.error('Error occured while fetching data', err));
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((ndata) => {
        console.log(ndata);
        const newData = data.filter((item) => {
          return item._id !== ndata._id;
        });
        setData(newData);
      })
      .catch((err) => console.error('Error occured while deleting post', err));
  };

  const unLikePost = (id) => {
    console.log('unlike');
    fetch(`/unlike`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((ndata) => {
        const newData = data.map((item) => {
          if (item._id === ndata._id) {
            return ndata;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.error('Error occured while fetching data', err));
  };

  const makeComment = (text, postId) => {
    fetch(`/comment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId,
        text: text,
      }),
    })
      .then((res) => res.json())
      .then((ndata) => {
        const newData = data.map((item) => {
          if (item._id === ndata._id) {
            return ndata;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.error('Error occured while adding comment', err));
  };

  return (
    <div className='home'>
      {data.map((item) => {
        return (
          <div className='card home-card' key={item._id}>
            <h5 style={{ padding: '5px' }}>
              <Link to={item.postedBy._id !== state._id ? '/profile/' + item.postedBy._id : '/profile'}>
                {item.postedBy.name}
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className='material-icons'
                  style={{
                    float: 'right',
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <div className='card-image'>
              <img src={item.photo} alt='' />
            </div>
            <div className='card-content'>
              <i className='material-icons' style={{ color: 'red' }}>
                favorite
              </i>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {!item.likes.includes(state._id) ? (
                <i className='material-icons' onClick={() => likePost(item._id)}>
                  thumb_up
                </i>
              ) : (
                <i className='material-icons' onClick={() => unLikePost(item._id)}>
                  thumb_down
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record, index) => {
                return [
                  <h6 key={index}>
                    <span style={{ fontWeight: '500' }}>{record.postedBy.name}</span> {record.text}
                  </h6>,
                ];
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = null;
                }}
              >
                <input type='text' placeholder='add your comment' />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscribesUserPost;
