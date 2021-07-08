import React from 'react';
import { Button } from '@material-ui/core';
import './Login.scss';
import { auth, provider } from '../../Auth/firebase';
import { useCustomHookStateValue } from '../../Context/StateProvider';
import { actionType } from '../../Context/reducer';

function Login() {
  const cssPrefix = 'login';
  const [{}, dispatch] = useCustomHookStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then(result => {
        dispatch({ type: actionType.SET_USER, user: result.user });
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <div className={cssPrefix}>
      <div className={`${cssPrefix}__container`}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt=""
        />
        <div className={`${cssPrefix}__text`}>
          <h1>Sign in to Whatsapp</h1>
        </div>
        <Button onClick={signIn}>Sign in With Google</Button>
      </div>
    </div>
  );
}

export default Login;
