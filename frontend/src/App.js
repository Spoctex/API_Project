import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import GroupList from "./components/GroupsComponents/GroupList";
import GroupDetails from "./components/GroupsComponents/GroupDetails";

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
          <Route exact path='/groups/:groupId'>
            <GroupDetails />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
