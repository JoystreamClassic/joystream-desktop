import React, {Component} from 'react'
import {observer} from 'mobx-react'
import UpdaterWindow from '../../updater-window/components/UpdaterWindow'
import UpdaterStore from  '../../updater-window/UpdaterStore'

import FlatButton from 'material-ui/FlatButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

@observer
class UpdaterFlow extends Component {

    constructor(props) {
        super(props)

        this.store = new UpdaterStore()
        this.handleReset() // ** we skip checking, since its not relevant to UI **
        this.store.setMostRecentVersion("11.12.13")
    }

    handleUseOldVersionClicked = () => {
        console.log('here we quit the autoupdater and do nothing')
    }

    handleQuitAndInstall = () => {
        console.log('here we quit the autoupdater and trigger install')
    }

    handleErrorClose = () => {
        console.log('here we quit the autoupdater and do nothing? or send error to server?')
    }

    handleUpdateAvailable = () => {
        this.store.setState('waiting-to-start-download') // releaseName
    }

    handleUpdateUnavailable = () => {
        this.store.setState('no-update-available')
    }

    handleDownloadUpdate = () => {
        this.store.setState('downloading')
    }

    handleDownloaded = () => {
        this.store.setState('waiting-to-start-install')
    }

    handleError = () => {
        this.store.setErrorMessage('This is an error message')
        this.store.setState('error')
    }

    handleReset = () => {
        this.store.setState('waiting-to-start-download')
    }

    handle

    render() {

        let styles = {
            actions : {
                display: 'flex'
            },
            updateContainer: {
                height: '353px',
                width: '466px'
            }
        }

        return (
            <Card>
                <CardTitle title={"Updater flow"}/>

                <div style={styles.updateContainer}>
                    <UpdaterWindow store={this.store}
                                   installedVersionString="7.8.9"
                                   onUseOldVersionClicked={this.handleUseOldVersionClicked}
                                   onUpdateClicked={this.handleDownloadUpdate}
                                   onInstallClicked={this.handleQuitAndInstall}
                                   onErrorCloseClicked={this.handleErrorClose}
                    />
                </div>


                <CardActions style={styles.actions}>

                    {
                            this.store.state === 'checking'
                            ?
                            <div>
                                <FlatButton label="Update available" onClick={this.handleUpdateAvailable}/>
                                <FlatButton label="No update available" onClick={this.handleUpdateUnavailable} />
                            </div>
                            :
                            null
                    }

                    { /** NO NEED FOR THIS, is used action
                            this.store.state === 'waiting-to-start-download'
                        ?
                            <div>
                                <FlatButton label="Download update" onClick={this.handleDownloadUpdate}/>
                            </div>

                        :
                            null
                     */
                    }

                    {
                            this.store.state === 'downloading'
                        ?
                            <div>
                                <FlatButton label="Finished downloading" onClick={this.handleDownloaded}/>
                            </div>
                        :
                            null
                    }

                    {
                        /** NO NEED FOR THIS, is user action
                        this.store.state === 'waiting-to-start-install'
                        ?
                            <div>
                                <FlatButton label="Install" onClick={this.handleInstall}/>
                            </div>
                        :
                            null
                         */
                    }

                    <FlatButton label="ERROR" onClick={this.handleError}/>
                    <FlatButton label="RESET" onClick={this.handleReset}/>

                </CardActions>

            </Card>
        )
    }

}

var {ipcRenderer, remote} = require('electron')

const UpdaterLauncher = (props) => {

    return (
        <Card>
            <CardTitle title={"Separate Autoupdater Window"}/>

            <CardActions >
                <FlatButton label="LAUNCH" onClick={() => {

                    // Send async message to main process
                    ipcRenderer.send('component-development', 'open-updater-window');

                }}/>
            </CardActions>

        </Card>
    )

}

export default UpdaterFlow
export {UpdaterLauncher}