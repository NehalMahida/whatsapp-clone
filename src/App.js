import './App.scss';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sliderbar from './components/Sidebar/Sidebar';
import Chat from './components/Chat/Chat';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import { useCustomHookStateValue } from './Context/StateProvider';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [{ user }, dispatch] = useCustomHookStateValue();
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current.clientWidth < 599) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [isMobile, containerRef]);

  return (
    <div className="app" ref={containerRef}>
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <BrowserRouter>
            {isMobile ? null : <Sliderbar />}
            <Switch>
              {isMobile ? <Sliderbar path="/" exact /> : null}
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
