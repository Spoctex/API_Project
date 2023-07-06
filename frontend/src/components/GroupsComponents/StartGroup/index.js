import GroupForm from '../GroupForm';
import './index.css';

function StartGroup (){
    const groupInfo ={new:true}
    return(
        <GroupForm groupInfo={groupInfo}/>
    )
}

export default StartGroup
