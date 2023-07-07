import Intro from './Intro';
import GetStarted from './GetStarted';
import './index.css'
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';

function Landing() {
    const user = useSelector(state => state.session.user);
    return (
        <div>
            <Intro />
            <div>
                <h3>
                    How Meetup Works
                </h3>
                <text>
                    Lorem Ipsum biuasfvbhjibasvfdbij
                </text>
            </div>
            <div>
                <GetStarted user={user} />
            </div>
            {!user && <OpenModalButton
                buttonText="Join Converge"
                modalComponent={<SignupFormModal />}
            />}
        </div>
    )
}

export default Landing;
