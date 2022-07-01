import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { isSelectAuth } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from '../../axios';

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(isSelectAuth)
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null);
  const { id } = useParams();
  const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url)
    } catch(err) {
      console.warn(err);
      alert('Upload file failed')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };
   
  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title,
        tags,
        imageUrl,
        text
      }

      const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);
      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`)
    } catch(err) {
      console.warn(err);
      alert('Post is not created')
    }
  }

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setText(data.text)
          setTags(data.tags.join(','))
          setImageUrl(data.imageUrl)
        })
        .catch(err => {
          console.warn(err)
          alert('Post is not found')
        })
    }
  }, [])

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Description...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Uplad image
      </Button>
      <input 
        ref={inputFileRef} 
        type="file" 
        onChange={handleChangeFile} 
        hidden 
      />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Remove
          </Button>
          <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Title..."
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Tags" 
        fullWidth 
        value={tags} 
        onChange={e => setTags(e.target.value)}
      />
      <SimpleMDE 
        className={styles.editor} 
        value={text} 
        onChange={onChange} 
        options={options} 
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Publish'}
        </Button>
        <a href="/">
          <Button size="large">Reject</Button>
        </a>
      </div>
    </Paper>
  );
};
