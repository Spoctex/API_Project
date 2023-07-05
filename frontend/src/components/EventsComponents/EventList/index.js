import { NavLink, useHistory } from 'react-router-dom';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEvents } from '../../../store/events';

function EventList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.events.allEvents))
    useEffect(() => { dispatch(getEvents()) }, [])
    
    return (
        <div>
            <div>
                <span>
                    Events
                </span>
                <NavLink to='/groups'>Groups</NavLink>
            </div>
            <text>Events in Converge</text>
            <div>
                {events.map(event => {
                    return (
                            <div onClick={() => history.push(`/events/${event.id}`)}>
                                <img src={event.previewImage} />
                                <div>
                                <div>
                                    <h4>{`${event.startDate?.slice(0,10)} * ${event.startDate?.slice(11,19)}`}</h4>
                                    <h3>{event.name}</h3>
                                    <h4>{`${event.Venue?.city}, ${event.Venue?.state}`}</h4>
                                </div>
                                </div>
                            <text>{event.description}</text>
                            </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EventList;
