import React from 'react';
import {users} from "../../store/resources";
import {withResources} from "../../services/withResources";
import './UsersView.scss';

class UsersView extends React.Component {
    viewUser(userId) {
        this.props.history.push('/users/' + userId);
    }

    render() {
        return <div className="users-view">
            {
                this.props.users.map(user => (
                    <div className="user"
                         key={user.id}
                         onClick={this.viewUser.bind(this, user.id)}
                    >
                        <div className="profile-picture"/>

                        <div className="details">
                            <span className="username">{user.username}</span>
                            <span className="name">{user.name}</span>
                        </div>

                        <span className="arrow glyphicon glyphicon-chevron-right"/>
                    </div>
                ))
            }
        </div>
    }
}

const resources = {
    users: users()
};

export default withResources(resources)(UsersView);