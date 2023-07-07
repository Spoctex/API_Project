import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getEvent } from '../../../store/events';
import DeleteModal from '../../DeleteModal';
import OpenModalButton from '../../OpenModalButton';


function EventDetails() {
    const dispatch = useDispatch();
    const { eventId } = useParams();
    const event = useSelector(state => state.events.singleEvent);
    useEffect(() => { dispatch(getEvent(eventId)) }, [dispatch, eventId]);
    console.log('EventDetails', event)

    return (
        <>
            <div>
                <span>
                    {'<'} <NavLink to='/events'>Events</NavLink>
                </span>
                <h3>{event.name}</h3>
                <h4>{`Hosted by ${event.Host}`}</h4>
            </div>
            <div>
                <div>
                    <img src={event.EventImages?.find(img => img.preview)?.url} />
                    <div>
                        <div>
                            <img src={event.Group?.previewImage} />
                            <div>
                                <h4>{event.Group?.name}</h4>
                                <h4>{event.Group?.private ? 'Private' : 'Public'}</h4>
                            </div>
                        </div>
                        <div>
                            <div>{`${event.startDate?.slice(0, 10)} * ${event.startDate?.slice(11, 19)}`}</div>
                            <div>{`${event.endDate?.slice(0, 10)} * ${event.endDate?.slice(11, 19)}`}</div>
                            <div>{event.price ? `$${event.price}` : 'Free'}</div>
                            <div>
                                <div>{event.type}</div>
                                <OpenModalButton buttonText='Delete' modalComponent={<DeleteModal deleteContext={{ type: 'Event', eventId: eventId, groupId:event.Group?.id }} />} />
                            </div>
                        </div>
                    </div>
                </div>
                <h2>Details</h2>
                <div>{event.description}</div>
            </div>
        </>
    );
}

export default EventDetails;
