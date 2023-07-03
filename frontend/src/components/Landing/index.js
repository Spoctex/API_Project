import Intro from './Intro';
import GetStarted from './GetStarted';
import './index.css'

function Landing() {
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
                <GetStarted />
            </div>
            <button>
                Join Meetup
            </button>
        </div>
    )
}

export default Landing;
