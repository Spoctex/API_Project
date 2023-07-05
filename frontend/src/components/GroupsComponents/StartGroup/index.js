import { useState } from 'react';
import './index.css';
import validStates from './validStates';

function StartGroup() {
    const [state,setState] = useState('')
    const [groupType,setGroupType] = useState('')
    const [groupPrivate,setGroupPrivate] = useState('')

    const handleSubmit = (e) =>{
        e.preventDefault();
    }



    return (
        <form onSubmit={handleSubmit}>
            <h4>BECOME AN ORGANIZER</h4>
            <h3>We'll walk you through a few steps to build your local community</h3>
            <div>
                <h3>First, set your group's location.</h3>
                <p>Converge groups meet locally, in person and online. We'll connect you with people
                    in your area, and more can join you online.</p>
                <input placeholder='City' />
                <select value={state} onChange={(e)=>setState(e.target.value)}>
                    <option value='' disabled>Select a state...</option>
                    {validStates.map(state => (<option>{state}</option>))}
                </select>
            </div>
            <div>
                <h3>What will your group's name be?</h3>
                <p>Choose a name that will give people a clear idea of what the group is about.
                    Feel free to get creative! You can edit this later if you change your mind.</p>
                <input placeholder='What is your group name?' />
            </div>
            <div>
                <h3>Now describe what your group will be about</h3>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                <p>1. What's the purpose of the group?</p>
                <p>2. Who should join?</p>
                <p>3. What will you do at your events?</p>
                <textarea placeholder='Please write at least 50 characters' />
            </div>
            <div>
                <h3>Final steps...</h3>
                <p>Is this an in person or online group?</p>
                <select value={groupType} onChange={(e)=>setGroupType(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                <p>Is this group private or public?</p>
                <select value={groupPrivate} onChange={(e)=>setGroupPrivate(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>Private</option>
                    <option>Public</option>
                </select>
                <p>Please add an image url for your group below:</p>
                <input placeholder='Image Url' />
            </div>
            <button type='submit'>Create group</button>
        </form>
    );
}

export default StartGroup;
