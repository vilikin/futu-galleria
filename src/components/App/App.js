import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import './App.scss';

export class App extends React.Component {
    render() {
        return <div className="App_component container">
            <header>
                <h1>Futu Gallery</h1>
            </header>

            <HashRouter>
                <Switch>
                    <Route exact path="/" render={() => <h2>Multiple items here</h2>}/>
                    <Route path="/picture/:id" render={() => <h2>One item here</h2>}/>
                </Switch>
            </HashRouter>
        </div>
    }
}

export default App;
