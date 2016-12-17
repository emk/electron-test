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

  render() {
    const { url, onSetUrl } = this.props

    function onOpen() {
      const files = dialog.showOpenDialog({
        title: "Open video",
        properties: ["openFile"]
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

    return (
      <div>
        <p>URL: {url}</p>
        <p>
          <button onClick={onOpen}>Open</button>
        </p>
      </div>
    )
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
