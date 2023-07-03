import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getGroup } from '../../../store/groups';


function GroupDetails() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.singleGroup)
    useEffect(() => dispatch(getGroup(groupId)), [dispatch,groupId])
    console.log('hi',group)
    return (
        <>
            <div>
               <span>
                {'<'} <NavLink to='/groups'>Groups</NavLink>
                </span>
                <div>
                    <img src={group.GroupImages?.find(img=>img.preview).url||''}/>
                    <div>
                        <h3>{group.name}</h3>
                        <h4>{`${group.city}, ${group.state}`}</h4>
                        <h4>{`${group.numMembers} members * ${group.private?'Private':'Public'}`}</h4>
                        <h4>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h4>
                        <button>Join this group</button>
                    </div>
                </div>
            </div>
            <div></div>
        </>
    );
}

export default GroupDetails;
