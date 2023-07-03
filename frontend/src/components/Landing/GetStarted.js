import { NavLink } from "react-router-dom";

function GetStarted() {
    return (
        <>
            <NavLink to='/groups'>
                See all groups
            </NavLink>
            <NavLink to='/events'>
                Find an event
            </NavLink>
            <NavLink to='/groups'>
                Start a new group
            </NavLink>
        </>
    )
}

export default GetStarted;
