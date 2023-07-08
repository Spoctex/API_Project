import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginInfo,setLoginInfo] = useState(true);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };
  const logDemo = (e) => {
    setErrors({});
    return dispatch(sessionActions.login({ credential:'Demo-lition', password:'password' }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

useEffect(()=>{
  if(password.length>5&&credential.length>3)setLoginInfo(false);
  else setLoginInfo(true);
},[password,credential])

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={loginInfo}>Log In</button>
      </form>
      <p onClick={logDemo} id='demoButton'>Demo User</p>
    </>
  );
}

export default LoginFormModal;
