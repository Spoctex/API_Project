import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/loadAll';
const LOAD_GROUP = 'groups/loadOne'

const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        payload: groups
    }
}

export const getGroups=()=>async dispatch=>{
    let groupsArr = await csrfFetch('/api/groups');
    groupsArr = await groupsArr.json();
    const groups = {};
    groupsArr.Groups.forEach(group=>{
        groups[group.id] = group;
    });
    dispatch(loadGroups(groups));
    return groups;
}

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
        default:
            return state;
    }
};

export default groupReducer;
