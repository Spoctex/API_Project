import { useDispatch, useSelector } from 'react-redux';
import './index.css';
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
    useEffect(() => { dispatch(getGroup(groupId)) }, [dispatch, groupId]);

    return (
        <>
            <div>
                <span>
                    {'<'} <NavLink to='/groups'>Groups</NavLink>
                </span>
                <div>
                    <img src={group.GroupImages?.find(img => img.preview)?.url} />
                    <div>
                        <h3>{group.name}</h3>
                        <h4>{`${group.city}, ${group.state}`}</h4>
                        <h4>{`${group.numMembers} members * ${group.private ? 'Private' : 'Public'}`}</h4>
                        <h4>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h4>
                        <button>Join this group</button>
                        <button>Create Event</button>
                        <button onClick={()=>history.push(`/groups/${groupId}/edit`)}>Update</button>
                        <OpenModalButton buttonText='Delete' modalComponent={<DeleteModal deleteContext={{type:'Group',id:groupId}}/>} />
                    </div>
                </div>
            </div>
            <div>
                <h3>Organizer</h3>
                <h4>{`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h4>
                <h3>What we're about</h3>
                <span>{group.about}</span>
                <h3>Events</h3>
                {group.Events?.map(event => {
                    return (
                        <div>
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
                })}
            </div>
        </>
    );
}

export default GroupDetails;
