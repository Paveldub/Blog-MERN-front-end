import React from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link, Navigate } from 'react-router-dom'

import { isSelectAuth, logout } from '../../redux/slices/auth';

export const Header = () => {
  const isAuth = useSelector(isSelectAuth)
  const userData = useSelector(state => state.auth.data);
  const dispatch = useDispatch()
  
  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      window.localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            Film list
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <span>{userData?.fullName}</span>
                <Link to="/add-post">
                  <Button variant="contained">Create article</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
