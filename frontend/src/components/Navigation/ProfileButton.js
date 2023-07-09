import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const [dropMark, setDropMark] = useState('v');
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
    setDropMark('^')
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
        setDropMark('v');
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    .then(()=>history.push('/'));
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id='profileDrop' onClick={openMenu}>
        <i className="fas fa-user-circle" />  {dropMark}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>Hello, {`${user.firstName}`}</li>
        <li>{user.email}</li>
        <li id='dropNavs'>
          <NavLink to='/groups'>View Groups</NavLink>
          <NavLink to='/events'>View Events</NavLink>
        </li>
        <li id='logOutLi'>
          <button id='logOut' onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
