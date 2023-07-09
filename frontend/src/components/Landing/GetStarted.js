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
            <a>
                Start a new group
            </a>
        )
    }
    return (
        <div id='getStarted'>
                <img src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256' />
                <img src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256' />
                <img src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256' />
                <NavLink to='/groups'>
                    See all groups
                </NavLink>
                <NavLink to='/events'>
                    Find an event
                </NavLink>
                {newGroup}
                <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
                <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
        </div>
    )
}

export default GetStarted;
