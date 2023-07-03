import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/loadAll';
const LOAD_GROUP = 'groups/loadOne'

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
    dispatch(loadGroup(group));
    return group;
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
