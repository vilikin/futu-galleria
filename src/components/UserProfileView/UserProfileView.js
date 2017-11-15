import React from 'react';
import './UserProfileView.scss';
import {albums, users} from "../../store/resources";
import {withResources} from "../../services/withResources";
import {Link} from "react-router-dom";

class UserProfileView extends React.Component {
    render() {
        const userId = parseInt(this.props.match.params.userId);
        const user = this.props.users.find(user => user.id === userId);
        const albums = this.props.albums;

        return <div className="user-profile-view">
            <div className="header">
                <div className="profile-picture"/>

                <div className="details">
                    <h2 className="username">{user.username}</h2>
                    <span className="name">{user.name}</span>
                </div>
            </div>

            <hr/>

            <h3>Albums</h3>

            {
                albums.map(album => (
                    <Link to={"/albums/" + album.id} key={album.id}>
                        <div className="album">
                            <span className="icon glyphicon glyphicon-folder-open"/>
                            {album.title}
                        </div>
                    </Link>
                ))
            }

            <div className="links">
                <Link to="/" className="button">
                    Back to users
                </Link>
            </div>
        </div>;
    }
}

const resources = (props) => ({
    users: users(),
    albums: albums(props.match.params.userId)
});

export default withResources(resources)(UserProfileView);