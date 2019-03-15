/**
 * Created by bedeho on 12/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {observer } from 'mobx-react'
import StatusBar,{ProgressStatusPanel} from '../../../../components/StatusBar'

const ApplicationStatusBar = observer((props) => {

    return (

        <StatusBar show={props.show}
                   bottom={true}
        >
            <ProgressStatusPanel title={'Loading torrents'}
                                 percentageProgress={props.startingTorrentCheckingProgressPercentage}
            />

        </StatusBar>
    )
})

ApplicationStatusBar.propTypes = {
    startingTorrentCheckingProgressPercentage : PropTypes.number.isRequired,
    show : PropTypes.bool.isRequired
}

export default ApplicationStatusBar