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
      <>
        <NavLink to='/groups/new'>
          Start a new group
        </NavLink>
        <ul>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
        </ul>
      </>
    );
  } else {
    sessionLinks = (
      <ul>
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
      </ul>
    );
  }

  return (
    <>
        <NavLink exact to="/">
          Home
        </NavLink>
      {isLoaded && sessionLinks}
    </>
  );
}

export default Navigation;
