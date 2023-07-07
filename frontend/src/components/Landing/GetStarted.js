import { NavLink } from "react-router-dom";

function GetStarted({ user }) {
    let newGroup;
    if (user) {
        newGroup = (
            <NavLink to='/groups/new'>
                Start a new group
            </NavLink>
        )
    } else {
        newGroup = (
            <p>
                Start a new group
            </p>
        )
    }
    return (
        <>
            <NavLink to='/groups'>
                See all groups
            </NavLink>
            <NavLink to='/events'>
                Find an event
            </NavLink>
            {newGroup}
        </>
    )
}

export default GetStarted;
