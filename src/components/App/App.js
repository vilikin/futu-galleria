import React from 'react';
import {HashRouter, Link, Route, Switch} from 'react-router-dom';

import './App.scss';
import {Provider} from "react-redux";

import Gallery from "../Gallery/Gallery";

import {createEnhancedStore} from '../../store/init';
import ImageView from "../ImageView/ImageView";
import NavBar from "../NavBar/NavBar";
import {albums, users} from "../../store/resources";
import {fetchResource} from "../../store/actions";

const store = createEnhancedStore();

store.dispatch(fetchResource(users()));
store.dispatch(fetchResource(albums()));

export class App extends React.Component {
    render() {
        return <Provider store={store}>
            <HashRouter onChange={this.handleRouteChange}>
                <div>
                    <NavBar title="The Futu Gallery"/>

                    <div className="App_component container">
                        <Switch>
                            <Route exact path="/albums/:albumId" component={Gallery}/>
                            <Route exact path="/all" render={() => <Gallery showAll/>}/>
                            <Route path="/photos/:photoId" component={ImageView}/>
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        </Provider>
    }
}

export default App;
