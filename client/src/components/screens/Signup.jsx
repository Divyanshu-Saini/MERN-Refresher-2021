/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      UserSignUp();
    }
  }, [url]);

  const uploadPic = async () => {
    try {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'insta_upl');
      data.append('cloud_name', 'testingkeys257');
      let res = await fetch('https://api.cloudinary.com/v1_1/testingkeys257/image/upload', {
        method: 'post',
        body: data,
      }).catch((err) => {
        throw new Error(err);
      });

      if (res.status === 200) {
        const uploadData = await res.json();
        setUrl(uploadData.url);
      }
    } catch (error) {
      console.log('Some error occured while uploading media', error);
    }
  };

  const UserSignUp = async () => {
    try {
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: 'invalid email', classes: 'red darken-3' });
        return;
      }
      const res = await fetch(`/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic: url,
        }),
      }).catch((err) => {
        throw new Error(err);
      });

      const data = await res.json();
      console.info('Sign up data', data, res);
      if (res.status !== 200) {
        M.toast({
          html: data.error,
          classes: 'red darken-2',
        });
      } else {
        M.toast({
          html: data.message,
          classes: 'green darken-1',
        });
        navigate('/signin');
      }
    } catch (error) {
      console.log('Some error occured whiule signing up', error);
    }
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      UserSignUp();
    }
  };

  return (
    <div className='mycard'>
      <div className='card auth-card input-field'>
        <h2>Instagram</h2>
        <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className='file-field input-field'>
          <div className='btn #64b5f6 blue darken-1'>
            <span>Upload pic</span>
            <input type='file' onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>
        <button className='btn waves-effect waves-light blue darken-1' onClick={PostData}>
          Sign Up
        </button>
        <h5>
          <Link to='/signin'>Already have a account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
