import React from 'react'
import InlineInput from './inline_input'
import MPL from 'mpl'
import wifiName from 'wifi-name'

export default class Network extends React.Component {
  constructor(props) {
    super(props)

    let bonjourEnabled = localStorage.getItem("bonjourEnabled")
    if(bonjourEnabled)
      bonjourEnabled = JSON.parse(bonjourEnabled)

    if(bonjourEnabled)
      this.props.network.signaler.enableBonjour()
    else
      this.props.network.signaler.disableBonjour()

    this.state = { 
      peers: {}, 
      connected: true, 
      bonjourEnabled: bonjourEnabled, 
      introducerStatus: "disconnected", 
      wifi: undefined 
    }

    wifiName().then(name => {
      let state = this.state
      state['wifi'] = name
      this.setState(state)
    });

    this.toggleNetwork = this.toggleNetwork.bind(this)
    this.toggleBonjour = this.toggleBonjour.bind(this)
    this.peerHandler = this.peerHandler.bind(this)
    this.doIntroduction = this.doIntroduction.bind(this)
    this.updatePeerName = this.updatePeerName.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  componentDidMount() {
    this.doIntroduction()
  }

  updatePeerName(value) {
    MPL.config.name = value
    localStorage.setItem("peerName", value)
    this.props.store.network.peergroup.setName(value)
  }

  doIntroduction() {
    let introducer = this.introductionInput.value
    localStorage.setItem("introducer", introducer)

    let [host, port] = introducer.split(':')
    this.setState({ introducerStatus: "connecting" }, () => {
      this.props.network.signaler.manualHello(host, port, (error) => {
        if(error) {
          console.log(error)
          this.setState({ introducerStatus: "error" })
        } else {
          this.setState({ introducerStatus: "connected" })
        }
      })
    })
  }

  // The constructor is not necessarily called on
  // re-renders, so set our webrtc listeners here
  componentWillReceiveProps(nextProps) {
    if(!nextProps.network) return

    this.props.network.peerStats.removeListener('peer', this.peerHandler)

    console.log("NEXT PROPS",nextProps)
    this.setState({
      peers: Object.assign({}, nextProps.network.peerStats.getStats())
    })

    nextProps.network.peerStats.on('peer', this.peerHandler)
  }

  peerHandler() {
    this.setState({
      peers: Object.assign({}, this.props.network.peerStats.getStats())
    })
  }

  toggleNetwork() {
    let newConnected = !this.state.connected

    this.setState({ peers: this.state.peers, connected: newConnected })

    if (this.props.network)
      if (newConnected)
      {
        this.props.network.connect()
        if (this.state.bonjourEnabled) this.props.network.signaler.enableBonjour()
        this.doIntroduction()
      }
      else
        this.props.network.disconnect()
  }

  toggleBonjour() {
    let newEnabled = !this.state.bonjourEnabled

    if(newEnabled)
      this.props.network.signaler.enableBonjour()
    else
      this.props.network.signaler.disableBonjour()

    localStorage.setItem("bonjourEnabled", JSON.stringify(newEnabled))
    this.setState({ bonjourEnabled: newEnabled })
  }

  formatUUID(uuid) {
    return uuid.toLowerCase().substring(0,4)
  }

  handleInput(event) {
    if(event.key === "Enter") {
      event.preventDefault()
      this.doIntroduction()
    }
  }

  render() {
    let peers = this.state.peers
    let peersPartial = Object.keys(peers).map((id, index) => {
      let peer = peers[id]
      let name = peer.name
      let ledStatus = peer.connected ? "connected" : "connecting"

      let ledKlass = "led " + ledStatus
      let key = "peer-" + id

      let namePartial
      if(peer.self)
        namePartial = <InlineInput onSubmit={ this.updatePeerName } defaultValue={ name }>{ name }</InlineInput>
      else
        namePartial = name

      return <tr key={key}>
            <td><div className={"led-" + ledStatus} /></td>
            <td className="user">{ namePartial }</td>
            <td className="id">{this.formatUUID(id)}</td>
            <td className="sent">{index > 0 ? peer.messagesSent : ""}</td>
            <td className="received">{index > 0 ? peer.messagesReceived : ""}</td>
          </tr>
    })

    let connected = this.state.connected ? "on" : "off"
    let switchPath = "assets/images/switch-" + connected + ".svg"

    let bonjourEnabled = this.state.bonjourEnabled ? "on" : "off"
    let bonjourSwitchPath = "assets/images/switch-" + bonjourEnabled + ".svg"

    let bonjourLed = this.state.bonjourEnabled ? "connected" : "disconnected"

    let introducerDefault
    if(process.env.INTRODUCER !== undefined)
      introducerDefault = process.env.INTRODUCER
    else if(localStorage.introducer !== "" && localStorage.introducer !== undefined)
      introducerDefault = localStorage.introducer
    else
      introducerDefault = "localhost:4242"

    return <div className="card network" style={{display: this.props.enabled? "block" : "none"}}>
        <div className="card-header">Network</div>
        <div className="card-body">
          <form>
            <div className="form-check form-control-sm">
              <label className="form-check-label">
                <input type="checkbox" className="form-check-input form-check-input-sm" 
                  checked={this.state.connected}
                  onClick={ this.toggleNetwork }/>
                Network enabled
              </label>
            </div>
            <div className="form-group form-control-sm">
              <label className="form-label-sm">Introducer</label>
              <div className="form-row">
                <div className="col">
                <input className="form-control form-control-sm" 
                  placeholder="ip:port" 
                  onKeyDown={ this.handleInput } 
                  ref={ (input) => this.introductionInput = input }
                  defaultValue={ introducerDefault }/>
                </div>
                <div className="col-3">
                <button onClick={ this.doIntroduction } className="btn btn-primary btn-sm">Connect</button>
                </div>
              </div>
            </div>
            <div className="form-check form-control-sm">
              <label className="form-check-label">
                <input type="checkbox" className="form-check-input" 
                  checked={this.state.bonjourEnabled}
                  onClick={ this.toggleBonjour }/>
                Bonjour ({this.state.wifi})
              </label>
            </div>
        </form>
        <table className="table">
          <thead><tr><th></th><th>Peer</th><th>ID</th><th>Tx</th><th>Rx</th></tr></thead>
          <tbody>{ peersPartial }</tbody>
        </table>

        </div>
      </div>
{/*
        <form>
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input type="checkbox" class="form-check-input">
              Check me out
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>



              <div className="Signalers">
                <div className="Signaler__introduce__title">
                  <div className={ "led-" + this.state.introducerStatus } />
                  Introducer
                </div>
                <div className="Signaler__introduce__detail">
                  <textarea 
                    placeholder="ip:port" 
                    onKeyDown={ this.handleInput } 
                    ref={ (input) => this.introductionInput = input }
                    defaultValue={ introducerDefault }
                  />
                </div>
                <div className="Signaler__introduce__action">
                  <button onClick={ this.doIntroduction }>Connect</button>
                </div>

                <div className="Signaler__bonjour__title">
                  <div className={ "led-" + bonjourLed  } />
                  Bonjour
                </div>
                <div className="Signaler__bonjour__detail">{this.state.wifi}</div>
                <div className="Signaler__bonjour__action">
                  <img className="bonjourSwitch" src={bonjourSwitchPath} onClick={ this.toggleBonjour } />
                </div>
              </div>

            </div>
*/}


  }
}
