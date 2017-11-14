import React from 'react';
import {HashRouter, Link, Route, Switch} from 'react-router-dom';

import './App.scss';
import {Provider} from "react-redux";

import Gallery from "../Gallery/Gallery";

import {createEnhancedStore} from '../../store/init';
import ImageView from "../ImageView/ImageView";
import NavBar from "../NavBar/NavBar";

const store = createEnhancedStore();

export class App extends React.Component {
    render() {
        return <Provider store={store}>
            <HashRouter>
                <div>
                    <NavBar title="The Futu Gallery"/>

                    <div className="App_component container">
                        <Switch>
                            <Route exact path="/" component={Gallery}/>
                            <Route path="/photos/:id" component={ImageView}/>
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        </Provider>
    }
}

export default App;
