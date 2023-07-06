import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import GroupList from "./components/GroupsComponents/GroupList";
import GroupDetails from "./components/GroupsComponents/GroupDetails";
import EventList from "./components/EventsComponents/EventList";
import EventDetails from "./components/EventsComponents/EventDetails";
import StartGroup from "./components/GroupsComponents/StartGroup";
import EditGroup from "./components/GroupsComponents/UpdateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
        <Route exact path='/'>
          <Landing />
        </Route>
          <Route exact path='/groups'>
            <GroupList />
          </Route>
          <Route exact path='/events'>
            <EventList />
          </Route>
          <Route exact path='/groups/new'>
            <StartGroup />
          </Route>
          <Route exact path='/groups/:groupId/edit'>
            <EditGroup />
          </Route>
          <Route exact path='/groups/:groupId'>
            <GroupDetails />
          </Route>
          <Route exact path='/events/:eventId'>
            <EventDetails />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
