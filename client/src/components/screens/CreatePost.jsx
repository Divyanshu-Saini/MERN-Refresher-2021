import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import M from 'materialize-css';

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (url) {
      const AddPost = async (title, body, url) => {
        try {
          const res = await fetch(`/createpost`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({
              title,
              body,
              pic: url,
            }),
          }).catch((err) => {
            throw new Error(err);
          });

          const data = await res.json();
          console.info('create Post', data, res);
          if (res.status !== 200) {
            M.toast({
              html: data.error,
              classes: 'red darken-2',
            });
          } else {
            M.toast({
              html: `Post created successfull`,
              classes: 'green darken-1',
            });
            navigate('/');
          }
        } catch (error) {
          console.log('Some error occured while posting data', error);
        }
      };

      AddPost(title, body, url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const postDetails = async () => {
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

  return (
    <div
      className='card input-field'
      style={{
        margin: '10% auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type='text' placeholder='Body' value={body} onChange={(e) => setBody(e.target.value)} />
      <div className='file-field input-field'>
        <div className='btn blue darken-1'>
          <span>Upload Image</span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>
      <button className='btn wave-effect wave-light blue darken-1' onClick={postDetails}>
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
