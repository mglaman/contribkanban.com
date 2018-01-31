import React, { Component } from 'react';
import Gravatar from "../gravatar";
import MyBoards from "./my-boards";

const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = drupalSettings.user;
  }
  render() {
    return(
      <div>
        <div className="box">
          <section className="media">
            <div className="media-left">
              <Gravatar md5={this.state.gravatar} name={this.state.email}/>
            </div>
            <div className="media-content">
              <div className="content">
                <h1>{this.state.email}</h1>
                <nav className="level is-mobile">
                  <div className="level-left">
                    <a className="level-item">
                      <a href={`${baseUrl}user/${this.state.uid}/edit`}>Edit</a>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </section>
        </div>
        <MyBoards uid={this.state.uid}/>
      </div>
    )
  }
}

export default UserProfile;