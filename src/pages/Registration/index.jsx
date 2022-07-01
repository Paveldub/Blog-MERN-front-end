import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { isSelectAuth } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";
import { fetchRegister } from '../../redux/slices/auth';

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isSelectAuth)

  const { 
      register, 
      handleSubmit, 
      setError, 
      formState: { errors, isValid }
    } = useForm({
      defaultValues: {
        fullName: 'Pavel Demidovich',
        email: 'dubstr1@gmail.com',
        password: 'wwwwww'
      },
    mode: 'all'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      alert('Не удалось зарегестрироваться')
    } 

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Register
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          className={styles.field} 
          label="Name" 
          fullWidth 
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Введите имя' })}
        />
        <TextField 
          className={styles.field} 
          label="E-Mail" 
          fullWidth 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email',
            },
          })}
        />
        <TextField 
          className={styles.field} 
          label="Password" 
          fullWidth 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Fill the password' })}
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>

    </Paper>
  );
};
