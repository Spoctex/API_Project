import { NavLink, useHistory } from 'react-router-dom';
import './GroupList.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getGroups } from '../../../store/groups';

function GroupList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const groups = useSelector(state => Object.values(state.groups.allGroups))
    useEffect(() => { dispatch(getGroups()) }, [])

    return (
        <div id='middle'>
            {/* <div> */}
            <div id='list'>
                <p id='hide'>gggg</p>
                <NavLink to='/events'>
                    Events
                </NavLink>
                <a id='inactive'>Groups</a>
                <p id='subTitle'>Groups in Converge</p>
                <div>
                    {groups.map(group => {
                        return (
                            <div className='card' onClick={() => history.push(`/groups/${group.id}`)}>
                                <img src={group.previewImage} />
                                <div className='info'>
                                    <h2>{group.name}</h2>
                                    <h3>{`${group.city}, ${group.state}`}</h3>
                                    <p>{group.about}</p>
                                    <h3>{`${group.numMembers} Members * ${group.private ? 'Private' : 'Public'}`}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}

export default GroupList;
