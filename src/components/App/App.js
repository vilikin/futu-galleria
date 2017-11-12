import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';

import './App.scss';
import {Provider} from "react-redux";

import Gallery from "../Gallery/Gallery";

import {createEnhancedStore} from '../../store/init';

const store = createEnhancedStore();

export class App extends React.Component {
    render() {
        return <Provider store={store}>
            <div className="App_component container">
                <header>
                    <h1>Futu Gallery</h1>
                </header>

                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={Gallery}/>
                        <Route path="/picture/:id" render={() => <h2>One item here</h2>}/>
                    </Switch>
                </HashRouter>
            </div>
        </Provider>
    }
}

export default App;
