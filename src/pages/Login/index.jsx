import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import { useForm } from 'react-hook-form';
import { fetchLogin, isSelectAuth } from '../../redux/slices/auth';
import { Navigate } from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isSelectAuth)

  console.log(isAuth)

  const { 
      register, 
      handleSubmit, 
      setError, 
      formState: { errors, isValid }
    } = useForm({
      defaultValues: {
        email: 'testfront@gmail.com',
        password: '123456'
      },
    mode: 'all'
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchLogin(values));

    if (!data.payload) {
      alert('Не удалось авторизоваться')
    } 

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  useEffect(() => {

  }, [])

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          fullWidth
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
          label="Пароль" 
          fullWidth 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введите пароль' })}
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
