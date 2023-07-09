import { useState } from 'react';
import './index.css';
import validStates from './validStates';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createGroup, getGroup, updateGroup } from '../../../store/groups';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

function GroupForm({ groupInfo }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [state, setState] = useState('');
    const [groupType, setGroupType] = useState('');
    const [groupPrivate, setGroupPrivate] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [city, setCity] = useState('');
    const [image, setImage] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const user = useSelector(state => state.session.user);
    const [groupOwnerId, setGroupOwnerId] = useState(user?.id);
    let organizerId;
    if (user) organizerId = user.id;
    const { groupId } = useParams();

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        let errs = {};
        if (state === '') errs.state = 'You must pick a state';
        if (groupType === '') errs.groupType = 'You must pick a type';
        if (groupPrivate === '') errs.groupPrivate = 'Visibility type is required';
        if (name === '') errs.name = 'You must give your group a name';
        if (name.length > 30) errs.name = `Your group's name can't exceed 30 characters in length`;
        if (about === '') errs.about = 'Please tell us about your group: Description must be at least 50 characters in length';
        if (about.length < 50) errs.about = 'Please be more descriptive about your group: Description must be at least 50 characters in length';
        if (city === '') errs.city = 'You must provide a city';
        if (groupInfo.new) {
            if (image === '') errs.image = 'You must provide an image';
            else {
                let invalidImage = true;
                ['.png', '.jpg', '.jpeg'].forEach(end => { if (image.endsWith(end)) invalidImage = false });
                if (invalidImage) errs.image = 'Image URL must end with .png, .jpg, or .jpeg';
            }
        }
        if (Object.values(errs).length) return setErrors(errs);


        let group = {
            name,
            state,
            city,
            about,
            organizerId,
            type: groupType,
            private: groupPrivate === 'Private' ? 'true' : 'false'
        };
        if (groupInfo.new) {
            const newGroup = await dispatch(createGroup(group, image));
            history.push(`/groups/${newGroup.id}`);
        } else {
            const reGroup = await dispatch(updateGroup(group, groupId));
            history.push(`/groups/${reGroup.id}`);
        }
    }

    useEffect(() => {
        async function once() {
            let group = await dispatch(getGroup(groupId));
            setState(group.state);
            setCity(group.city);
            setAbout(group.about);
            setGroupType(group.type);
            setGroupPrivate(group.private ? 'Private' : 'Public');
            setName(group.name);
            setGroupOwnerId(group.Organizer.id)
        }
        if (!groupInfo.new) once();
    }, [])


    if (!user || (!groupInfo.new && user.id !== groupOwnerId))return (<Redirect to='/'/>)
    return (
        <form id='groupForm' onSubmit={onSubmit}>
            {groupInfo.new ? <h3 id='groupFormHead'>BECOME AN ORGANIZER</h3> :
                <h3 id='groupFormHead'>UPDATE YOUR GROUP'S INFORMATION</h3>}
            {groupInfo.new ? <h1 className='groupFormTitle'>We'll walk you through a few steps to build your local community</h1> :
                <h1 className='groupFormTitle'>We'll walk you through a few steps to update your group's information</h1>}
            <div className='groupFormWrap'>
                <div className='groupFormWrap2'>
                    <h1 className='groupFormTitle'>First, set your group's location.</h1>
                    <p>Converge groups meet locally, in person and online. We'll connect you with people
                        in your area, and more can join you online.</p>
                    <input placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                    {submitted && errors.city && <div className='groupFormErrors'><p>{errors.city}</p></div>}
                    <select id='groupState' value={state} onChange={(e) => setState(e.target.value)}>
                        <option value='' disabled>Select a state...</option>
                        1           {validStates.map(state => (<option>{state}</option>))}
                    </select>
                    {submitted && errors.state && <div className='groupFormErrors'><p>{errors.state}</p></div>}
                </div>
            </div>
            <div className='groupFormWrap'>
                <div className='groupFormWrap2'>
                    <h1 className='groupFormTitle'>What will your group's name be?</h1>
                    <p>Choose a name that will give people a clear idea of what the group is about.
                        Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input placeholder='What is your group name?' value={name} onChange={(e) => setName(e.target.value)} />
                    {submitted && errors.name && <div className='groupFormErrors'><p>{errors.name}</p></div>}
                </div>
            </div>
            <div className='groupFormWrap'>
                <div className='groupFormWrap2'>
                    <h1 className='groupFormTitle'>Now describe what your group will be about</h1>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                    <div id='aboutList'>
                        <p>1. What's the purpose of the group?</p>
                        <p>2. Who should join?</p>
                        <p>3. What will you do at your events?</p>
                    </div>
                    <textarea placeholder='Please write at least 50 characters' value={about} onChange={(e) => setAbout(e.target.value)} />
                    {submitted && errors.about && <div className='groupFormErrors'><p>{errors.about}</p></div>}
                </div>
            </div>
            <div className='groupFormWrap'>
                <div className='groupFormWrap2' id='groupFinalSteps'>
                    <h1 className='groupFormTitle'>Final steps...</h1>
                    <p>Is this an in person or online group?</p>
                    <select value={groupType} onChange={(e) => setGroupType(e.target.value)}>
                        <option value='' disabled>{'(Select one)'}</option>
                        <option>In person</option>
                        <option>Online</option>
                    </select>
                    {submitted && errors.groupType && <div className='groupFormErrors'><p>{errors.groupType}</p></div>}
                    <p>Is this group private or public?</p>
                    <select value={groupPrivate} onChange={(e) => setGroupPrivate(e.target.value)}>
                        <option value='' disabled>{'(Select one)'}</option>
                        <option>Private</option>
                        <option>Public</option>
                    </select>
                    {submitted && errors.groupPrivate && <div className='groupFormErrors'><p>{errors.groupPrivate}</p></div>}
                    {groupInfo.new && <p>Please add an image url for your group below:</p>}
                    {groupInfo.new && <input placeholder='Image Url' value={image} onChange={(e) => setImage(e.target.value)} />}
                    {groupInfo.new && submitted && errors.image && <div className='groupFormErrors'><p>{errors.image}</p></div>}
                </div>
            </div>
            <div className='groupFormWrap'>
                <button id='groupFormButton' type='submit'>{groupInfo.new ? 'Create group' : 'Update Group'}</button>
            </div>
        </form>
    );
}

export default GroupForm;
