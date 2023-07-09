import { useDispatch, useSelector } from 'react-redux';
import './GroupDetails.css';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { getGroup } from '../../../store/groups';
import OpenModalButton from '../../OpenModalButton';
import DeleteModal from '../../DeleteModal';


function GroupDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.singleGroup);
    const user = useSelector(state => state.session.user);
    useEffect(() => { dispatch(getGroup(groupId)) }, [dispatch, groupId]);

    let groupButtons;
    console.log(user, group)
    if (user?.id === group?.organizerId) {
        groupButtons = (
            <div>
                <button onClick={() => history.push(`/groups/${groupId}/events/new`)}>Create Event</button>
                <button onClick={() => history.push(`/groups/${groupId}/edit`)}>Update</button>
                <OpenModalButton buttonText='Delete' modalComponent={<DeleteModal deleteContext={{ type: 'Group', groupId: groupId }} />} />
            </div>
        )
    } else {
        groupButtons = (
            <button id='joinGroup'>Join This Group</button>
        )
    }


    let eventCards;
    if (group.Events?.length) {
        let now = new Date();
        now = now.getTime();
        let upcoming = group.Events?.filter(event => {
            let start = new Date(event.startDate);
            start = start.getTime();
            return start > now;
        })
        let past = group.Events?.filter(event => {
            let start = new Date(event.startDate);
            start = start.getTime();
            return start <= now;
        })
        console.log('upcoming', upcoming, 'past', past)



        function eventCardCreate(eventArr) {
            return eventArr.map(event => {
                return (
                    <div className='cardGroup' onClick={() => history.push(`/events/${event.id}`)}>
                        <div>
                            <img className='cardIMGGroup' src={event.previewImage} />
                            <div className='cardInfoGroup'>
                                <h3>{`${event.startDate.slice(0, 10)} * ${event.startDate.slice(11, 19)}`}</h3>
                                <h2>{event.name}</h2>
                                <h4>{`${event.Venue.city}, ${event.Venue.state}`}</h4>
                            </div>
                        </div>
                        <p>{event.description}</p>
                    </div>
                );
            })
        }

        eventCards = (<>
            {!!upcoming.length && <h3>Upcoming Events ({upcoming.length})</h3>}
            {!!upcoming.length && eventCardCreate(upcoming)}
            {!!past.length && <h3>Past Events ({past.length})</h3>}
            {!!past.length && eventCardCreate(past)}
        </>)
    } else eventCards = (<h3>No Upcoming Events</h3>)


    return (
        <div>
            <div id='middleWelcomeGroup'>
                <p id='hideGroup'>gggg</p>
                <div>
                    <span id='breadcrumbGroup'>
                        {'<'} <NavLink to='/groups'>Groups</NavLink>
                    </span>
                    <div id='welcomeGroup'>
                        <img src={group.GroupImages?.find(img => img.preview)?.url} />
                        <div id='welcomeInfoGroup'>
                            <h1>{group.name}</h1>
                            <h3>{`${group.city}, ${group.state}`}</h3>
                            <h3>{`${group.numMembers} members · ${group.private ? 'Private' : 'Public'}`}</h3>
                            <h3>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h3>
                            <div id='buttonsGroup'>
                                {groupButtons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='bottomGroup'>
                <div>
                    <h3>Organizer</h3>
                    <h4>{`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h4>
                    <h3>What we're about</h3>
                    <p>{group.about}</p>
                    {eventCards}
                    {/* <h3>Events</h3>
                {group.Events?.map(event => {
                    return (
                        <div onClick={()=>history.push(`/events/${event.id}`)}>
                            <div>
                                <img src={event.previewImage} />
                                <div>
                                    <h4>{`${event.startDate.slice(0, 10)} * ${event.startDate.slice(11, 19)}`}</h4>
                                    <h4>{event.name}</h4>
                                    <span>{`${event.Venue.city}, ${event.Venue.state}`}</span>
                                </div>
                            </div>
                            <span>{event.description}</span>
                        </div>
                    );
                })} */}
                </div>
            </div>
        </div>
    );
}

export default GroupDetails;
