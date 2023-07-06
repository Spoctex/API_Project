import { useSelector } from 'react-redux';
import GroupForm from '../GroupForm';
import './index.css';

function EditGroup (){
    const groupInfo={new:false}
    return(
        <GroupForm groupInfo={groupInfo}/>
    )
}

export default EditGroup
