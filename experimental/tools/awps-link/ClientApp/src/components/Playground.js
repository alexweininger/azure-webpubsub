import React, { Component } from 'react';

export class Playground extends Component {
  static displayName = Playground.name;

  constructor(props) {
    super(props);
    this.state = {
      loading: true, endpoint: "", url: "", hub: ""
      , connected: false
    };

    this.connect = this.connect.bind(this);
    this.send = this.send.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('webpubsuburl');
    const data = await response.json();
    this.setState({
      loading: false,
      endpoint: data.endpoint,
      url: data.url,
      hub: data.hub
    });
  }

  componentWillUnmount() {
    if(this.connection) this.connection.close();
  }

  connect() {
    const connection = new WebSocket(this.state.url);
    connection.addEventListener('open', (event) => {
      this.setState({ connected: true });
    });
    connection.addEventListener('close', (event) => {
      this.setState({ connected: false });
    });
    connection.addEventListener('error', (event) => {
      console.error(event);
    });
    this.connection = connection;
  }

  send() {
    if (!this.connection) {
      console.error("Connection is not connected");
      return;
    }
    this.connection.send("Hello");
  }
  render() {
    return (
      <div className="overflow-auto playground">
        <h2>Playground</h2>

        <p>Play with Web PubSub endpoint: <strong>{this.state.endpoint}</strong> hub: <i>{this.state.hub}</i></p>

        <button className="btn btn-outline-success" hidden={this.state.loading} onClick={this.connect}>Connect</button>
        <button className="btn btn-outline-primary" hidden={!this.state.connected} onClick={this.send}>Send</button>
      </div>
    );
  }
}
