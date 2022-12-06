import React, { Component } from 'react';
import * as signalR from '@microsoft/signalr';
import { Playground } from './Playground';
import './Dashboard.css';

export class Dashboard extends Component {
  static displayName = Dashboard.name;

  constructor(props) {
    super(props);
    this.state = {
      forecasts: [], loading: true,

      selectedItem: null, connected: false, serviceUrl: "<TODO:GetServiceUrl>", upstreamServerUrl: "<TODO:GetUpstreamServerUrl>",
      showPlayground: true
    };
  }

  componentDidMount() {
    this.populateData();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/datahub')
      .withAutomaticReconnect()
      .build();
    connection.start()
      .then(() => {
        console.log('SignalR connection established.');
      })
      .catch((err) => {
        console.log('SignalR connection failed: ', err);
      });// listen for updates from the server
    connection.on('updateData', (newData) => {
      console.log(`Get new data ${JSON.stringify(newData)}`);
      newData.unread = true;
      this.state.forecasts.unshift(newData);
      this.setState({ forecasts: this.state.forecasts });
    });
    this.connection = connection;
  }

  componentWillUnmount() {
    // stop the SignalR connection
    console.log("Stopping the connection " + this.connection.connectionId);
    this.connection.stop();
  }

  onItemClick(item) {
    item.unread = false;
    this.setState({ selectedItem: item });
  }

  render() {
    let requestContainer = this.state.loading
      ? <div><h2>Requests</h2><p><em>Loading...</em></p></div>
      : (
        <div className="d-flex flex-row">
          <div className="table-container overflow-auto">
            <h2>Requests</h2>
            <table className='table' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                  <th>RequestAt</th>
                  <th>TracingId</th>
                  <th>MethodName</th>
                  <th>Url</th>
                  <th>Response Code</th>
                </tr>
              </thead>
              <tbody>
                {this.state.forecasts.map(item =>
                  <tr key={item.id} className={item.unread ? 'unread' : (item === this.state.selectedItem ? 'active' : '')} onClick={() => this.onItemClick(item)}>
                    <td>{item.requestAt}</td>
                    <td>{item.tracingId}</td>
                    <td>{item.methodName}</td>
                    <td>{item.url}</td>
                    <td>{item.code}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {this.state.selectedItem &&
              Details(this.state.selectedItem)
          }
        </div>
      );

    return (
      <div class="d-flex flex-column fullPage">
        <div class="workflow d-flex flex-row justify-content-around">
          <div class="client d-flex flex-column align-items-center">Client
            <button className="btn btn-success" onClick={() => this.setState({ showPlayground: !this.state.showPlayground })}>Playground</button></div>
          <div class="arrow">(TODO: animation)----</div>
          <div class="service">{this.state.serviceUrl} {this.state.connected ? "Online" : "Offline"} </div>
          <div class="arrow">(TODO: animation)----</div>
          <div class="server">-- Upstream server {this.state.upstreamServerUrl}</div>
        </div>
        <div class="fullPage d-flex flex-row justify-content-start">
          {this.state.showPlayground && <Playground></Playground>}
          {requestContainer}
        </div>
      </div>
    );
  }

  async populateData() {
    const response = await fetch('httphistory');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}

function Details(item) {
  return (
    <div class="panel-container d-flex flex-column">
      <div class="request overflow-auto">

        <h5>{item.methodName} {item.url}</h5>
        <p>{item.requestAt}</p>
        <div style={{ whiteSpace: 'pre-wrap' }}>{item.requestRaw}</div>
      </div>
      <div class="response overflow-auto">
        <h5>Response Detail</h5>
        <p>{item.code}</p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{item.responseRaw}</p>
      </div>

    </div>
  );
}

