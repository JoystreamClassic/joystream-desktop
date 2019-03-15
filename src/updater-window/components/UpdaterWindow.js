import React, {Component} from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'

import UpdaterWindowFrame from './UpdaterWindowFrame'
import Error from './Error'
import WaitingToStartDownload from './WaitingToStartDownload'
import Downloading from './Downloading'
import ReadyToInstall from './ReadyToInstall'

@observer
class UpdaterWindow extends Component {

  constructor (props) {
    super(props)
  }

  render () {

    return (
      <UpdaterWindowFrame>
          {this.getRenderedWindowBody()}
      </UpdaterWindowFrame>
    )
  }

  getRenderedWindowBody() {

    const state = this.props.store.state

    console.log(state)

    if(state === 'error')
        return <Error errorMessage={this.props.store.errorMessage}
                      onCloseClicked={this.props.onErrorCloseClicked}/>
    else if(state === 'waiting-to-start-download')
        return <WaitingToStartDownload installedVersionString={this.props.store.installedVersionString}
                                       newVersionString={this.props.store.mostRecentVersion}
                                       onUseOldVersionClicked={this.props.onUseOldVersionClicked}
                                       onUpdateClicked={this.props.onUpdateClicked}/>
    else if(state === 'downloading')
        return <Downloading />
    else if(state === 'waiting-to-start-install')
        return <ReadyToInstall onInstallClicked={this.props.onInstallClicked}  />

  }
}

UpdaterWindow.propTypes = {
  store: PropTypes.object.isRequired,
  onUseOldVersionClicked: PropTypes.func.isRequired,
  onUpdateClicked: PropTypes.func.isRequired,
  onInstallClicked: PropTypes.func.isRequired,
  onErrorCloseClicked: PropTypes.func.isRequired
}

export default UpdaterWindow
