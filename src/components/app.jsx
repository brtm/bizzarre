import React from 'react'

import Canvas from './canvas/canvas'

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

  // render

  render() {
    let history = this.store.getHistory()

    return (
      <div className="App">
        <Canvas model={this.store.getState()}
          onAddCard={this.addCard.bind(this)} 
          onDropCard={this.dropCard.bind(this)}
          onResizeCard={this.resizeCard.bind(this)}
          />
        {/*<Board ref={ (node) => this.board = node } highlightOptions={{ cardId: highlightCard }} store={ this.store } />*/}
        {/*<Inspector store={ this.store } highlightOptions={{ tableName: "cards", row: cardIndex }} />*/}
        <div className="Sidebar">
          <Network network={ this.store.network } store={ this.store } />
          {/*<Documents recentDocs={ this.getRecentDocsAsList() } network={ this.store.network } openDocument={ this.open } myDocId={ this.getDocId() } myName={ MPL.config.name } />*/}
          <Changes store={ this.store } history={ history } />
        </div>
      </div>
    )
  }
}
