import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div id='userButtons'>
        <NavLink to='/groups/new'>
          Start a new group
        </NavLink>
        <div>
        <ProfileButton user={sessionUser} />
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div id='loginButtons'>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  return (
    <div id='navBar'>
      <NavLink exact to="/">
        <img id='logo' src='https://realfavicongenerator.net/files/cd99cb24628c920e5de0ce14b29e323e30e354d6/package_files/favicon.ico' />
      </NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
