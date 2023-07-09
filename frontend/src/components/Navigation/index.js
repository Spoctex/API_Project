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
        <img id='logo' src='https://static.wixstatic.com/media/50019b_8a38ed5e19f848cda17abf2c2522bba9~mv2_d_1961_2193_s_2.png/v1/fill/w_1961,h_2193,al_c/50019b_8a38ed5e19f848cda17abf2c2522bba9~mv2_d_1961_2193_s_2.png' />
      </NavLink>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
