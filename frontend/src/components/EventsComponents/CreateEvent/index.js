import { useEffect, useState } from 'react';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { getGroup } from '../../../store/groups';
import { createEvent } from '../../../store/events';

function CreateEvent() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [group, setGroup] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventPrivate, setEventPrivate] = useState('');
    const [price, setPrice] = useState();
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const user = useSelector(state => state.session.user);
    const [groupOwnerId, setGroupOwnerId] = useState(user?.id);


    useEffect(() => {
        async function once() {
            let groupLoad = await dispatch(getGroup(groupId));
            setGroup(groupLoad);
        }
        once();
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        let errs = {};
        if (eventType === '') errs.eventType = 'You must pick a type';
        if (eventPrivate === '') errs.eventPrivate = 'Visibility type is required';
        if (name === '') errs.name = 'You must give your event a name';


        if (price) {
            let price1 = price.split('.');
            if ((price1[1] && (isNaN(price1[1]) || price1[1].length > 2)) || Number(price1[0]) < 0 || isNaN(price1[0])) errs.price = 'Please provide a valid price';
        } else errs.price = 'Please provide a valid price';


        if (name.length > 30) errs.name = `Your event's name can't exceed 30 characters in length`;
        if (description === '') errs.description = 'Please tell us about your event: Description must be at least 50 characters in length';
        if (description.length < 50) errs.description = 'Please be more descriptive about your event: Description must be at least 50 characters in length';


        let start1;
        let startCont = true;
        try {
            start1 = new Date(start);
        } catch {
            errs.start = 'Please provide a valid date';
            startCont = false;
        }
        let start2;
        if (startCont) {
            start2 = start1.getTime();
            let now = new Date();
            now = now.getTime();
            if (!(start2 > now)) {
                errs.start = 'Start date must be in the future';
                startCont = false;
            }
        }


        let end1;
        let endCont = true;
        if (end === '') errs.end = 'Please provide an end date'
        try {
            end1 = new Date(end);
        } catch {
            errs.end = 'Please provide a valid end date';
            endCont = false;
        }
        let end2;
        if (startCont && endCont) {
            end2 = end1.getTime();
            if (!(end2 > start2)) errs.end = 'End date must be after the start date';
        }


        if (image === '') errs.image = 'You must provide an image';
        else {
            let invalidImage = true;
            ['.png', '.jpg', '.jpeg'].forEach(end => { if (image.endsWith(end)) invalidImage = false });
            if (invalidImage) errs.image = 'Image URL must end with .png, .jpg, or .jpeg';
        }
        if (Object.values(errs).length) return setErrors(errs);


        let event = {
            venueId: 2,
            name,
            type: eventType,
            capacity: 10,
            price,
            description,
            startDate: start,
            endDate: end,
            groupId
        };
        const newEvent = await dispatch(createEvent(event, image));
        history.push(`/events/${newEvent.id}`);
    }

    useEffect(() => {
        async function once() {
            let group = await dispatch(getGroup(groupId));
            setGroupOwnerId(group.Organizer.id)
        }
        once();
    }, [])


    if (!user || (user && user.id !== groupOwnerId)) return (<Redirect to='/' />)
    return (
        <form id='eventForm' onSubmit={onSubmit}>
            <h1 className='eventFormTitle'>{`Create an event for ${group.name}`}</h1>
            <div className='eventFormWrap'>
                <p>What is the name of your event?</p>
                <input placeholder='Event Name' value={name} onChange={(e) => setName(e.target.value)} />
                {submitted && errors.name && <p className='eventFormErrors'>{errors.name}</p>}
            </div>
            <div className='eventFormWrap'>
                <p>Is this an in person or online event?</p>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                {submitted && errors.eventType && <p className='eventFormErrors'>{errors.eventType}</p>}
                {/* <p id='eventSelect1'>Is this event private or public?</p>
                <select value={eventPrivate} onChange={(e) => setEventPrivate(e.target.value)}>
                    <option value='' disabled>{'(Select one)'}</option>
                    <option>Private</option>
                    <option>Public</option>
                </select>
                {submitted && errors.eventPrivate && <p className='eventFormErrors'>{errors.eventPrivate}</p>} */}
                <p id='eventSelect2'>What is the price for your event?</p>
                <input placeholder='$ 0.00' value={price} onChange={(e) => setPrice(e.target.value)} />
                {submitted && errors.price && <p className='eventFormErrors'>{errors.price}</p>}
            </div>
            <div className='eventFormWrap'>
                <p>When does your event start?</p>
                <input type='datetime-local' value={start} onChange={(e) => setStart(e.target.value)} />
                {submitted && errors.start && <p className='eventFormErrors'>{errors.start}</p>}
                <p id='eventFormDate1'>When does your event end?</p>
                <input id='eventFormDate2' type='datetime-local' value={end} onChange={(e) => setEnd(e.target.value)} />
                {submitted && errors.end && <p className='eventFormErrors'>{errors.end}</p>}
            </div>
            <div className='eventFormWrap'>
                <p>Please add an image url for your event below:</p>
                <input id='eventImageInput' placeholder='Image Url' value={image} onChange={(e) => setImage(e.target.value)} />
                {submitted && errors.image && <p className='eventFormErrors'>{errors.image}</p>}
            </div>
            <div className='eventFormWrap'>
                <p>Please describe you event:</p>
                <textarea placeholder='Please write at least 50 characters' value={description} onChange={(e) => setDescription(e.target.value)} />
                {submitted && errors.description && <p className='eventFormErrors'>{errors.description}</p>}
            </div>
            <button id='eventFormButton' type='submit'>Create Event</button>
        </form>
    )
}

export default CreateEvent;
