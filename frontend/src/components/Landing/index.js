import GetStarted from './GetStarted';
import './Landing.css'
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';

function Landing() {
    const user = useSelector(state => state.session.user);
    return (
        <div>
            <div id='intro'>
                <div>
                    <h1>The people platform—Where interests become friendships</h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Converge. Events are happening every day—sign up to join the fun.</p>
                </div>
                <img src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640' />
            </div>
            <div id='howTo'>
                <h2>
                    How Converge Works
                </h2>
                <p>
                    Meet new people who share your interests through online and in-person events. It’s free to create an account.
                </p>
            </div>
            <div>
                <GetStarted user={user} />
            </div>
            <div id='signup2'>
            {!user && <OpenModalButton
                buttonText="Join Converge"
                modalComponent={<SignupFormModal />}
            />}
            </div>
        </div>
    )
}

export default Landing;
