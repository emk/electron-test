import React = require('react')
import ReactDOM = require('react-dom')
import { createStore } from 'redux'
import Electron = require('electron')
import { format as urlFormat } from 'url'
import objectAssign = require("object-assign")

// Get access to dialog boxes in our main UI process.
const remote = Electron.remote

// The state of our movie player.
interface PlayerState {
  url?: string
  width: number,
  height: number
}

function newPlayerState(): PlayerState {
  return {
    url: undefined,
    width: window.innerWidth,
    height: window.innerHeight
  }
}

type SET_URL = "SET_URL";
const SET_URL: SET_URL = "SET_URL";

type SetUrlAction = {
  type: SET_URL,
  url: string
}

function setUrl(url: string): SetUrlAction {
  return { type: SET_URL, url: url }
}

type SET_SIZE = "SET_SIZE";
const SET_SIZE: SET_SIZE = "SET_SIZE";

type SetSizeAction = {
  type: SET_SIZE,
  width: number,
  height: number
}

function setSize(width: number, height: number): SetSizeAction {
  return { type: SET_SIZE, width: width, height: height }
}

type OtherAction = { type: '' }
const OtherAction: OtherAction = { type: '' }

type PlayerAction = SetUrlAction | SetSizeAction | OtherAction

function player(state: PlayerState = newPlayerState(),
  action: PlayerAction): PlayerState {
  switch (action.type) {
    case SET_URL:
      return objectAssign(state, { url: action.url })
    case SET_SIZE:
      return objectAssign(state, { width: action.width, height: action.height })
    default:
      return state
  }
}

interface IPlayerProps {
  url?: string,
  onSetUrl: (url: string) => void,
  onSetSize: (width: number, height: number) => void
}

interface INoState {
}

class Player extends React.Component<IPlayerProps, INoState> {
  static propTypes = {
    url: React.PropTypes.string,
    onSetUrl: React.PropTypes.func.isRequired,
    onSetSize: React.PropTypes.func.isRequired
  }

  render() {
    const { url } = this.props
    if (url) {
      return this.renderVideo(url)
    } else {
      return this.renderOpenButton()
    }
  }

  renderVideo(url: string) {
    const { onSetSize } = this.props
    function onLoadedMetadata(event: React.SyntheticEvent<HTMLVideoElement>) {
      onSetSize(event.currentTarget.videoWidth, event.currentTarget.videoHeight)
    }
    return <video src={url} onLoadedMetadata={onLoadedMetadata} controls></video>
  }

  renderOpenButton() {
    const { onSetUrl } = this.props

    function onOpen() {
      const files = remote.dialog.showOpenDialog({
        title: "Open video",
        properties: ["openFile"],
        filters: [
          { name: "Video Files", extensions: ["mp4"] }
        ]
      })
      if (files) {
        const url = urlFormat({
          pathname: files[0],
          protocol: 'file:',
          slashes: true
        })
        onSetUrl(url)
      }
    }

    return <button onClick={onOpen}>Open</button>
  }
}

const store = createStore(player)

function render() {
  ReactDOM.render(
    <Player
      url={(store.getState() || newPlayerState()).url}
      onSetUrl={(url) => store.dispatch(setUrl(url))}
      onSetSize={(w, h) => Electron.ipcRenderer.send("video-size", w, h)}
      />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
