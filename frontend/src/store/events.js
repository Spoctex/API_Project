import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/loadAll';
const LOAD_EVENT = 'events/loadOne'

//ACTIONS===========================================================================================

const loadEvents = (events) => {
    return {
        type: LOAD_EVENTS,
        payload: events
    }
}

const loadEvent = (event) => {
    return {
        type: LOAD_EVENT,
        payload: event
    }
}

//THUNKS===========================================================================================

export const getEvents = () => async dispatch => {
    let eventsArr = await csrfFetch('/api/events');
    eventsArr = await eventsArr.json();
    const events = {};
    eventsArr.Events.forEach(event => {
        events[event.id] = event;
    });
    dispatch(loadEvents(events));
    return events;
}

export const getEvent = (id) => async dispatch => {
    let event = await csrfFetch(`/api/events/${id}`);
    event = await event.json();
    let group = await csrfFetch(`/api/groups/${event.Group.id}`);
    group= await group.json();
    event.Host = `${group.Organizer.firstName} ${group.Organizer.lastName}`;
    event.Group.previewImage = group.GroupImages[0].url;
    dispatch(loadEvent(event));
    return event;
}

export const createEvent = (event, image) => async dispatch => {
    let newEvent = await csrfFetch(`/api/groups/${event.groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(event)
    });
    newEvent = await newEvent.json();
    let newImage = await csrfFetch(`/api/events/${newEvent.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            preview: true,
            url: image
        })
    });
    newEvent = await csrfFetch(`/api/events/${newEvent.id}`)
    newEvent = await newEvent.json();
    dispatch(loadEvent(newEvent));
    return newEvent;
}

export const deleteEvent = (id) => async dispatch =>{
    let res = await csrfFetch(`/api/events/${id}`,{
        method: 'DELETE'
    });
    dispatch(loadEvent({}))
    return
}

//REDUCER & INITAL STATE===========================================================================================

const initialState = { allEvents: {}, singleEvent: {} }

const eventReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_EVENTS:
            newState = Object.assign({}, state);
            newState.allEvents = action.payload;
            return newState;
        case LOAD_EVENT:
            newState = Object.assign({}, state);
            newState.singleEvent = action.payload;
            return newState;
        default:
            return state;
    }
};

export default eventReducer;
