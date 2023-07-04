import { NavLink, useHistory } from 'react-router-dom';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getGroups } from '../../../store/groups';

function GroupList(){
    const history = useHistory();
    const dispatch = useDispatch();
    const groups = useSelector(state=>Object.values(state.groups.allGroups))
    useEffect(()=>{dispatch(getGroups())},[])
    console.log('allGroups state',groups);

    return (
        <div>
            <div>
            <NavLink to='/events'>
                Events
            </NavLink>
            <text>Groups</text>
            </div>
            <text>Groups in Converge</text>
            <div>
                {groups.map(group=>{
                    return(
                        <div onClick={()=>history.push(`/groups/${group.id}`)}>
                            {/* <img src={group.previewImage}/> */}
                            <div>
                                <h3>{group.name}</h3>
                                <h4>{`${group.city}, ${group.name}`}</h4>
                                <text>{group.about}</text>
                                <h4>{`${group.numMembers} Members * ${group.private? 'Private':'Public'}`}</h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GroupList;
