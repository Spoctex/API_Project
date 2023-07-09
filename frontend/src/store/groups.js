import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/loadAll';
const LOAD_GROUP = 'groups/loadOne';
const POST_GROUP = 'groups/post';

//ACTIONS===========================================================================================

const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        payload: groups
    }
}

const loadGroup = (group) => {
    return {
        type: LOAD_GROUP,
        payload: group
    }
}

//THUNKS===========================================================================================

export const getGroups = () => async dispatch => {
    let groupsArr = await csrfFetch('/api/groups');
    groupsArr = await groupsArr.json();
    const groups = {};
    groupsArr.Groups.forEach(group => {
        groups[group.id] = group;
    });
    dispatch(loadGroups(groups));
    return groups;
}

export const getGroup = (id) => async dispatch => {
    let group = await csrfFetch(`/api/groups/${id}`);
    group = await group.json();
    let groupEvents = await csrfFetch(`/api/groups/${id}/events`);
    groupEvents = await groupEvents.json();
    group.Events = groupEvents.Events;
    dispatch(loadGroup(group));
    return group;
}

export const createGroup = (group, image) => async dispatch => {
    let newGroup = await csrfFetch(`/api/groups/`, {
        method: 'POST',
        body: JSON.stringify(group)
    });
    newGroup = await newGroup.json();
    let newImage = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            preview: true,
            url: image
        })
    });
    newImage = await newImage.json();
    newGroup.GroupImages = [newImage];
    dispatch(loadGroup(newGroup));
    return newGroup;
}

export const updateGroup = (group, id) => async dispatch => {
    let reGroup = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(group)
    });
    reGroup = reGroup.json();
    dispatch(loadGroup(reGroup));
    return reGroup;
}

export const deleteGroup = (id) => async dispatch => {
    let res = await csrfFetch(`/api/groups/${id}`, {
        method: 'DELETE'
    });
    dispatch(loadGroup({}))
    return
}

//REDUCER & INITAL STATE===========================================================================================

const initialState = {
    allGroups: {},
    singleGroup: {}
};

const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_GROUPS:
            newState = Object.assign({}, state);
            newState.allGroups = action.payload;
            return newState;
        case LOAD_GROUP:
            newState = Object.assign({}, state);
            newState.singleGroup = action.payload;
            return newState;
        default:
            return state;
    }
};

export default groupReducer;
