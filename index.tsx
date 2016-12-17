import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import * as Electron from 'electron'
import { format as urlFormat } from 'url';

// Get access to dialog boxes in our main UI process.
const dialog = Electron.remote.dialog

// The state of our movie player.
interface PlayerState {
  url?: string
}

type SET_URL = "SET_URL";
const SET_URL: SET_URL = "SET_URL";

type SetUrlAction = {
  type: SET_URL,
  url: string
}

function setUrlAction(url: string): SetUrlAction {
  return { type: SET_URL, url: url }
}

type OtherAction = { type: '' }
const OtherAction: OtherAction = { type: '' }

type PlayerAction = SetUrlAction | OtherAction

function player(state: PlayerState = {}, action: PlayerAction): PlayerState {
  switch (action.type) {
    case SET_URL:
      // TODO: Use immutability-helper for updates.
      return { url: action.url }
    default:
      return state
  }
}

interface IPlayerProps {
  url?: string,
  onSetUrl: (url: string) => void
}

interface INoState {
}

class Player extends React.Component<IPlayerProps, INoState> {
  static propTypes = {
    url: React.PropTypes.string,
    onSetUrl: React.PropTypes.func.isRequired
  }

  renderOpenButton(onSetUrl: (url: string) => void) {
    function onOpen() {
      const files = dialog.showOpenDialog({
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

    return <div className="splash"><button onClick={onOpen}>Open</button></div>
  }

  renderVideo(url: string) {
    return <video src={url} controls></video>
  }

  render() {
    const { url, onSetUrl } = this.props
    if (url) {
      return this.renderVideo(url)
    } else {
      return this.renderOpenButton(onSetUrl)
    }
  }
}

const store = createStore(player)

function render() {
  ReactDOM.render(
    <Player
      url={(store.getState() || {}).url}
      onSetUrl={(url) => store.dispatch(setUrlAction(url))}
      />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
