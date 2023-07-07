import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './index.css';
import { useDispatch } from 'react-redux';
import { deleteGroup } from '../../store/groups';
import { deleteEvent } from '../../store/events';

function DeleteModal({ deleteContext }) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();


    const handleDelete = () => {
        switch (deleteContext.type) {
            case 'Group':
                console.log('Group Case working')
                return dispatch(deleteGroup(deleteContext.groupId))
                .then(()=>{history.push('/groups/')})
                .then(closeModal);
            case 'Event':
                console.log('Event Case working')
                return dispatch(deleteEvent(deleteContext.eventId))
                .then(()=>{history.push(`/groups/${deleteContext.groupId}`)})
                .then(closeModal);
            default:
                closeModal();
                break;
        }
    }

    return (
        <>
            <h1>Confirm Delete</h1>
            <h3>{`Are you sure you want to remove this ${deleteContext.type}?`}</h3>
            <button onClick={handleDelete}>{`Yes (Delete ${deleteContext.type})`}</button>
            <button onClick={closeModal}>{`No (Keep ${deleteContext.type})`}</button>
        </>
    )
}

export default DeleteModal
