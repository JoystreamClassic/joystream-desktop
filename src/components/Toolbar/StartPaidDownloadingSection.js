/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import ButtonSection from './ButtonSection'
//import ViabilityOfPaidDownloadingTorrent from '../../scenes/Common/ViabilityOfPaidDownloadingTorrent'

/**
 * Bizarre!!!!!: HMR seems to break the use instanceof
 * ---------
 * of [instanceof StartPaidDownloadingViability.*] here, totally unablw
 * to figure out what is going on. Before a reload, everything works,
 * after reload, it breaks. Primary hypothesis is that reload is
 * some how leading to some constructor functions to get reloaded in some part
 * of the codebase, which is creating new prototypes for them, but that
 * other parts of the codebase are using older constructors with other prototypes, breaking
 * instanceof.
 *
 * Using constructor.name === for now
 */

const StartPaidDownloadingSection = observer((props) => {


    /**
     * Bizarre!!!!!: HMR seems to break the use instanceof
     * ---------
     * of [instanceof StartPaidDownloadingViability.*] here, totally unablw
     * to figure out what is going on. Before a reload, everything works,
     * after reload, it breaks. Primary hypothesis is that reload is
     * some how leading to some constructor functions to get reloaded in some part
     * of the codebase, which is creating new prototypes for them, but that
     * other parts of the codebase are using older constructors with other prototypes, breaking
     * instanceof.
     *
     * Using constructor.name === for now
     */

    // This one breaks
    //console.log(props.row.torrentStore.startPaidDownloadViability instanceof StartPaidDownloadViability.NoJoyStreamPeerConnections)
    //console.log(props.row.torrentStore.startPaidDownloadViability.constructor.name === 'NoJoyStreamPeerConnections')

    // Derive ButtonSection props
    let className
    let onClick

    if(props.row.viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart' && !props.row.beingRemoved) {
        className = "start_paid_downloading"
        onClick = () => { props.row.torrentStore.startPaidDownload() }
    } else {
        className = "start_paid_downloading-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip="Start paid speedup" onClick={onClick}>
            <BlockedStartBadge viabilityOfPaidDownloadingTorrent={props.row.viabilityOfPaidDownloadingTorrent}
                               beingRemoved={props.row.beingRemoved} />
        </ButtonSection>
    )
})

StartPaidDownloadingSection.propTypes = {
    row : PropTypes.object.isRequired, // TorrentTableRowStore really, but HMR breaks instanceof
}

import SvgIcon from 'material-ui/SvgIcon'

const AlertIcon = (props) => {

    let style = {
        height : '12px',
        width : '12px'
    }

    let color= '#ffffff'

    return (
        <SvgIcon {...props} viewBox={'0 0 24 24'} style={style}>
            <path fill={color} d="M16.555,20.603l-0.306,1.254c-1.038,0.409-4.634,2.125-6.708,0.299c-0.618-0.543-0.927-1.233-0.927-2.069 c0-1.567,0.516-2.933,1.442-6.213c0.163-0.619,0.363-1.424,0.363-2.062c0-1.1-0.417-1.393-1.55-1.393 c-0.553,0-1.165,0.197-1.719,0.404l0.307-1.254c1.235-0.502,2.786-1.114,4.115-1.114c1.993,0,3.458,0.994,3.458,2.884 c0,0.545-0.094,1.499-0.292,2.159l-1.146,4.054c-0.236,0.82-0.666,2.626-0.002,3.162C14.245,21.243,15.792,20.963,16.555,20.603z"></path>
            <circle fill={color} cx="14.5" cy="3.5" r="2.5"></circle>
        </SvgIcon>
    )
}

const BlockedStartBadge = (props) => {
    if(props.beingRemoved)
      return null

    let content = blockedBadgeContent(props.viabilityOfPaidDownloadingTorrent)

    if(!content)
        return null

    return (
        <Badge {...content}/>
    )
}

function blockedBadgeContent(viabilityOfPaidDownloadingTorrent)  {

    if(viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart')
        return null

    let icon = <AlertIcon />
    let tooltip = "placeholder while coding"

    if(viabilityOfPaidDownloadingTorrent.constructor.name === 'Stopped')
        tooltip = "Download stopped"
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'AlreadyStarted')
        tooltip = "Already paying"
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'WalletNotReady')
        tooltip = 'Wallet not ready'
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'InViable') {

        let viability = viabilityOfPaidDownloadingTorrent.swarmViability
        let constructorName = viability.constructor.name

        if(constructorName === 'NoJoyStreamPeerConnections')
            tooltip = "No JoyStream peers "
        else if(constructorName === 'NoSellersAmongJoyStreamPeers')
            tooltip = "No peer is selling"
        else if(constructorName === 'InSufficientNumberOfSellersInvited')
            tooltip = "Miniumum seller count not reached"
        else if(constructorName === 'InSufficientNumberOfSellersHaveJoined')
            tooltip = "Insufficient sellers have joined contract"
        else {

            // only leaves ViabilityOfPaidDownloadInSwarm.Viable, which should not be
            // possible when we are inviable. (symptom of bad code, should really refactor to separate
            // positive and negative swarmViability types into groups)

            //assert(false)

            tooltip = 'impossible: should be inviable, instead was:  ' + constructorName

            console.log('impossible: should be inviable, instead was:  ' + constructorName)
        }

    } else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'InsufficientFunds')
        tooltip = "Insufficient funds"
    else {

        console.log('should not come here')

        assert(false)

        //assert(viabilityOfPaidDownloadingTorrent instanceof ViabilityOfPaidDownloadingTorrent.CanStart)

        return null
    }

    return {
        icon : icon,
        tooltip : tooltip
    }
}

import ReactTooltip from 'react-tooltip'

const Badge = (props) => {

    let styles = {
        root : {
            display :  'flex',
            alignItems : 'center',
            justifyContent: 'center',
            height : '20px',
            width : '20px',
            backgroundColor : '#f18732',
            borderRadius : '3px',
            position : 'relative',
            top : '15px',
            left : '15px'
        }
    }

    return (
        <div style={styles.root} data-tip data-for={"badge"}>
            {props.icon}
            <ReactTooltip id={"badge"}
                          place='bottom'
                          effect='solid'
                          className="torrent_table_start_paid_downloading_badge_tooltip"
            >
                {props.tooltip}
            </ReactTooltip>
        </div>
    )

}

Badge.propTypes = {
    tooltip : PropTypes.string.isRequired,
    icon : PropTypes.node.isRequired
}

export default StartPaidDownloadingSection
