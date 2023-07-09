import { NavLink, useHistory } from 'react-router-dom';
import './EventList.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEvents } from '../../../store/events';

function EventList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const events = useSelector(state => Object.values(state.events.allEvents))
    useEffect(() => { dispatch(getEvents()) }, [])

    return (
        <div id='middleEvents'>
            {/* <div> */}
            <div id='listEvents'>
                <p id='hideEvents'>gggg</p>
                <a id='inactiveEvents'>
                    Events
                </a>
                <NavLink to='/groups'>Groups</NavLink>
                <p id='subTitleEvents'>Events in Converge</p>
                <div>
                    {events.map(event => {
                        return (
                            <div className='cardEvents' onClick={() => history.push(`/events/${event.id}`)}>
                                <div>
                                    <img src={event.previewImage} />
                                    <div className='infoEvents'>
                                        <h3>{`${event.startDate?.slice(0, 10)} * ${event.startDate?.slice(11, 19)}`}</h3>
                                        <h1>{event.name}</h1>
                                        <h3>{`${event.Venue?.city}, ${event.Venue?.state}`}</h3>
                                    </div>
                                </div>
                                <p>{event.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}

export default EventList;
