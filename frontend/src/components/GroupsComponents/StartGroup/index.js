import { useState } from 'react';
import './index.css';
import validStates from './validStates';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroup } from '../../../store/groups';

function StartGroup() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [state,setState] = useState('');
    const [groupType,setGroupType] = useState('');
    const [groupPrivate,setGroupPrivate] = useState('');
    const [name,setName] = useState('');
    const [about,setAbout] = useState('');
    const [city,setCity] = useState('');
    const [image, setImage] = useState('');
    const [errors,setErrors] = useState({});
    const [submitted,setSubmitted] = useState(false);
    const organizer = useSelector(state => state.session.user);
    let organizerId;
    if (organizer)organizerId=organizer.id;

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setSubmitted(true);
        let errs = {};
        if (state==='')errs.state = 'You must pick a state';
        if (groupType==='')errs.groupType = 'You must pick a type';
        if (groupPrivate==='')errs.groupPrivate = 'Visibility type is required';
        if (name==='')errs.name = 'You must give your group a name';
        if (name.length > 30)errs.name = `Your group's name can't exceed 30 characters in length`;
        if (about==='')errs.about = 'Please tell us about your group: Description must be at least 50 characters in length';
        if (about.length < 50)errs.about = 'Please be more descriptive about your group: Description must be at least 50 characters in length';
        if (city==='')errs.city = 'You must provide a city';
        if (image==='')errs.image = 'You must provide an image';
        else {
            let invalidImage = true;
            ['.png','.jpg','.jpeg'].forEach(end=>{if(image.endsWith(end))invalidImage=false});
            if (invalidImage)errs.image = 'Image URL must end with .png, .jpg, or .jpeg';
        }
        if (Object.values(errs).length) return setErrors(errs);
        let group = {
            name,
            state,
            city,
            about,
            organizerId,
            type: groupType,
            private: groupPrivate==='Private'?'true':'false'
        };
        console.log(group.private)
        const newGroup = await dispatch(createGroup(group,image));
        history.push(`/groups/${newGroup.id}`);
    }



    return (
        <form onSubmit={handleSubmit}>
            <h4>BECOME AN ORGANIZER</h4>
            <h3>We'll walk you through a few steps to build your local community</h3>
            <div>
                <h3>First, set your group's location.</h3>
                <p>Converge groups meet locally, in person and online. We'll connect you with people
                    in your area, and more can join you online.</p>
                <input placeholder='City' value={city} onChange={(e)=>setCity(e.target.value)} />
                {submitted && errors.city && <p>{errors.city}</p>}
                <select value={state} onChange={(e)=>setState(e.target.value)}>
                    <option value='' disabled>Select a state...</option>
                    {validStates.map(state => (<option>{state}</option>))}
                </select>
                {submitted && errors.state && <p>{errors.state}</p>}
            </div>
            <div>
                <h3>What will your group's name be?</h3>
                <p>Choose a name that will give people a clear idea of what the group is about.
                    Feel free to get creative! You can edit this later if you change your mind.</p>
                <input placeholder='What is your group name?'  value={name} onChange={(e)=>setName(e.target.value)}/>
                {submitted && errors.name && <p>{errors.name}</p>}
            </div>
            <div>
                <h3>Now describe what your group will be about</h3>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                <p>1. What's the purpose of the group?</p>
                <p>2. Who should join?</p>
                <p>3. What will you do at your events?</p>
                <textarea placeholder='Please write at least 50 characters'  value={about} onChange={(e)=>setAbout(e.target.value)}/>
                {submitted && errors.about && <p>{errors.about}</p>}
            </div>
            <div>
                <h3>Final steps...</h3>
                <p>Is this an in person or online group?</p>
                <select value={groupType} onChange={(e)=>setGroupType(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                {submitted && errors.groupType && <p>{errors.groupType}</p>}
                <p>Is this group private or public?</p>
                <select value={groupPrivate} onChange={(e)=>setGroupPrivate(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>Private</option>
                    <option>Public</option>
                </select>
                {submitted && errors.groupPrivate && <p>{errors.groupPrivate}</p>}
                <p>Please add an image url for your group below:</p>
                <input placeholder='Image Url'  value={image} onChange={(e)=>setImage(e.target.value)}/>
                {submitted && errors.image && <p>{errors.image}</p>}
            </div>
            <button type='submit'>Create group</button>
        </form>
    );
}

export default StartGroup;