import { useDispatch, useSelector } from 'react-redux';
import './EventDetails.css';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getEvent } from '../../../store/events';
import DeleteModal from '../../DeleteModal';
import OpenModalButton from '../../OpenModalButton';
import { useHistory } from 'react-router-dom';


function EventDetails() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { eventId } = useParams();
    const event = useSelector(state => state.events.singleEvent);
    const user = useSelector(state => state.session.user);
    useEffect(() => { dispatch(getEvent(eventId)) }, [dispatch, eventId]);

    return (
        <>
            <div id='titleEvent'>
                <p id='hideEvent'>gggg</p>
                <span id='breadcrumbEvent'>
                    {'<'} <NavLink to='/events'>Events</NavLink>
                </span>
                <h1>{event.name}</h1>
                <h3>{`Hosted by ${event.Host}`}</h3>
            </div>
            <div id='eventDetails'>
                <div id='welcomeEvent'>
                    <img src={event.EventImages?.find(img => img.preview)?.url} />
                    <div>
                        <div id='groupCardEvent' onClick={() => history.push(`/groups/${event.Group?.id}`)}>
                            <img src={event.Group?.previewImage} />
                            <div>
                                <h4>{event.Group?.name}</h4>
                                <h4>{event.Group?.private ? 'Private' : 'Public'}</h4>
                            </div>
                        </div>
                        <div id='eventDetailsCard'>
                            <div id='startEndEvent'>
                                <div className='eventDetailsText'>START</div>
                                <div className='eventTime'>{`${event.startDate?.slice(0, 10)} * ${event.startDate?.slice(11, 19)}`}</div>
                                <div className='eventDetailsText'>END</div>
                                <div className='eventTime'>{`${event.endDate?.slice(0, 10)} * ${event.endDate?.slice(11, 19)}`}</div>
                            </div>
                            <div className='eventDetailsText'>{event.price ? `$ ${event.price}` : 'Free'}</div>
                            <div className='eventDetailsText'>
                                <div>{event.type}</div>
                                {user?.id === event.organizerId && <OpenModalButton buttonText='Delete' modalComponent={<DeleteModal deleteContext={{ type: 'Event', eventId: eventId, groupId: event.Group?.id }} />} />}
                            </div>
                        </div>
                    </div>
                </div>
                <h1>Details</h1>
                <p>{event.description}</p>
            </div>
        </>
    );
}

export default EventDetails;
