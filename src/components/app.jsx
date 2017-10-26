import React from 'react'

import Canvas from './canvas/canvas'
import CardProperties from './cardproperties';

import Store from '../lib/store'
import { ipcRenderer, remote } from 'electron'
import fs from 'fs'
import Path from 'path'
import MPL from 'mpl'

// devtools
import Inspector from './devtools/inspector/inspector'
import Network from './devtools/network'
import Documents from './devtools/documents'
import Changes from './devtools/changes'

const {dialog} = require('electron').remote

export default class App extends React.Component {
  constructor(props) {
    super(props)

    window.app    = this
    this.open     = this.open.bind(this)
    this.store    = new Store()

    this.state = {selected: null,
      networkViewEnabled: true,
      changesViewEnabled: true};

    this.store.subscribe(() => {
      this.setState({}) // Force component to re-render
    })

    ipcRenderer.on("new", (event) => {
      this.open()
    })

    ipcRenderer.on("forkDocument", () => {
      this.fork()
    })

    ipcRenderer.on("openFromClipboard", (event, docUrl) => {
      let m = docUrl.match(/bizzare:\/\/([a-z0-9-]+)/)
      if (m) {
        this.open(m[1])
      } else {
        dialog.showErrorBox("Invalid document URL", "Should be trellis:// but your clipboard contains:\n\n" + docUrl)
      }
    })

    ipcRenderer.on("shareToClipboard", (event) => {
      ipcRenderer.send("shareToClipboardResult", this.getDocUrl())
    })

    ipcRenderer.on("toggleNetworkView", (event) => {
      const {networkViewEnabled} = this.state;
      this.setState({networkViewEnabled: !networkViewEnabled});
    })

    ipcRenderer.on("toggleChangesView", (event) => {
      const {changesViewEnabled} = this.state;
      this.setState({changesViewEnabled: !changesViewEnabled});
    })
  }

  componentDidMount() {
    this.open()
  }

  getDocId() {
    return this.store.getState().docId
  }

  getDocUrl() {
    return "bizzare://" + this.getDocId()
  }

  getDocTitle() {
    return this.store.getState().boardTitle
  }

  setWindowTitle() {
    remote.getCurrentWindow().setTitle(this.getDocUrl())
  }

  open(docId) {
    if(!docId) {
      this.store.dispatch({ type: "NEW_DOCUMENT" })
    } 
    else {
      this.store.dispatch({ type: "OPEN_DOCUMENT", docId: docId })
    }

    this.setState({}) // hack to force re-render

    this.setWindowTitle()
  }

  fork() {
    this.store.dispatch({ type: "FORK_DOCUMENT" })
    this.setState({}) // hack to force re-render
    this.setWindowTitle()
  }

  // funcs

  addCard(x, y) {
    this.store.dispatch({
      type: 'ADD_CARD',
      x: x,
      y: y
    });
  }

  dropCard(card, x, y, deltaX, deltaY) {
    this.store.dispatch({
      type: 'DROP_CARD',
      card: card,
      x: x,
      y: y,
      deltaX: deltaX,
      deltaY: deltaY
    })
  }

  resizeCard(card, width, height) {
    this.store.dispatch({
      type: 'RESIZE_CARD',
      card: card,
      width: width,
      height: height
    });
  }

  changeCardName(card, name) {
    this.store.dispatch({
      type: 'RENAME_CARD',
      card: card,
      name: name
    });
  }

  changeCardColor(card, color) {
    this.store.dispatch({
      type: 'CHANGE_CARD_COLOR',
      card: card,
      color: color
    })
  }

  moveToFront(card) {
    this.store.dispatch({
      type: 'MOVE_CARD_TO_FRONT',
      card: card
    });
  }

  moveToBack(card) {
    this.store.dispatch({
      type: 'MOVE_CARD_TO_BACK',
      card: card
    });
  }

  deleteCard(card) {
    this.store.dispatch({
      type: 'DELETE_CARD',
      card: card
    });
  }

  duplicateCard(card) {
    this.store.dispatch({
      type: 'DUPLICATE_CARD',
      card: card
    });
  }

  select(card) {
    //const cardId = card !== null? card.id : null;
    this.setState({selected: card});
  }

  isSelected(card) {
    const {selected} = this.state;
    return selected && card.id === selected.id;
  }

  // render

  render() {
    let history = this.store.getHistory()

    return (
      <div className="App">
        <div className="grid">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="lightgray" strokeWidth="0.5"/>
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                      <rect width="100" height="100" fill="url(#smallGrid)"/>
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="lightgray" strokeWidth="1"/>
                  </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="Sidebar">
          <CardProperties 
            selection={this.state.selected}
            onColorChange={this.changeCardColor.bind(this)}
            onMoveToFront={this.moveToFront.bind(this)}
            onMoveToBack={this.moveToBack.bind(this)}
            onDelete={this.deleteCard.bind(this)}
            onDuplicate={this.duplicateCard.bind(this)}
            />
          <Network enabled={this.state.networkViewEnabled} network={ this.store.network } store={ this.store } />
          {/*<Documents recentDocs={ this.getRecentDocsAsList() } network={ this.store.network } openDocument={ this.open } myDocId={ this.getDocId() } myName={ MPL.config.name } />*/}
          <Changes enabled={this.state.changesViewEnabled} store={ this.store } history={ history } />
        </div>

        <Canvas model={this.store.getState()}
          onAddCard={this.addCard.bind(this)} 
          onDropCard={this.dropCard.bind(this)}
          onResizeCard={this.resizeCard.bind(this)}
          onSelect={this.select.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onChangeCardName={this.changeCardName.bind(this)}
          />
        {/*<Inspector store={ this.store } highlightOptions={{ tableName: "cards", row: cardIndex }} />*/}
      </div>
    )
  }
}
