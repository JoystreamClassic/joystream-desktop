/**
 * Created by bedeho on 21/03/2018.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Field} from './../../../components/Table'
import { Provider, observer, inject } from 'mobx-react'
import assert from 'assert'
import ReactTooltip from 'react-tooltip'
import CircularProgress from 'material-ui/CircularProgress'

function getColors(props, state) {

  if (props.torrentTableRowStore.viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart') {

    if(props.torrentTableRowStore.startingPaidDownload) {

      return {
        textColor: 'black',
        subTextColor: 'rgba(0,0,0, 0.7)',
        borderColor : 'transparent',
        background : 'hsla(180, 1%, 80%, 0.4)'
      }

    } else if (props.torrentTableRowStore.blockedStartingPaidDownloadForSwarmLatencySampling) {

      return {
        textColor: 'rgba(139, 152, 27, 1)',
        subTextColor: 'rgba(139, 152, 27, 0.7)',
        borderColor : 'transparent',
        background : '#cddc39'
      }

    } else {

      if (state.hover) {
        return {
          textColor: 'white',
          subTextColor: 'rgba(255,255,255, 0.7)',
          borderColor : 'transparent',
          background : '#378b61'
        }
      } else {
        return {
          textColor: 'white',
          subTextColor: 'rgba(255,255,255, 0.7)',
          borderColor : 'transparent', //'rgba(92, 184, 92, 0.7)',
          background : 'rgb(84, 187, 135)' //'rgba(92, 184, 92, 0.3)'
        }
      }

    }

  } else if (props.torrentTableRowStore.viabilityOfPaidDownloadingTorrent.constructor.name === 'InsufficientFunds') {

    return {
      textColor: 'white',
      subTextColor: 'rgba(255,255,255, 0.7)',
      borderColor : 'transparent',
      background : '#ff9800'
    }

  } else if (props.torrentTableRowStore.viabilityOfPaidDownloadingTorrent.constructor.name === 'AlreadyStarted') {
    return {
      textColor: 'black',
      subTextColor: 'rgba(0,0,0, 0.7)',
      borderColor : 'transparent',
      background : 'hsla(180, 1%, 80%, 0.4)'
    }
  }

  // not viable or torrent is already downloaded
  return {
    textColor: 'rgba(208, 208, 208, 1)',
    subTextColor: 'rgba(208, 208, 208, 0.7)',
    borderColor : '#dedede', //'rgba(240, 173, 78, 1)',
    background : 'transparent' // rgba(240, 173, 78, 0.4)'
  }

}

function getStyles(props, state) {

  let color = getColors(props, state)
// rgb(84, 187, 135)
  return {
    colors: color,
    root : {
      display : 'flex',
      flexDirection : 'row',
      flex: '0 0 210px',
      fontSize : '12px',
      color : color.textColor,
      border : '1px solid ' + color.borderColor,
      borderRadius : '50px',
      fontWeight : 'bold',
      height : '45px', // 50px
      backgroundColor : color.background,
      //justifyContent: 'center'
    },
    iconContainer : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex : '0 0 30px',
      marginLeft: '10px',
      paddingRight: '10px',
      //borderRight: '1px solid' + color.borderColor
    },
    textContainer : {
      display : 'flex',
      flexDirection : 'column',
      alignItems: 'center', //'flex-start', // vertical
      justifyContent: 'center', // horizontal,
      flexGrow: '1',
      marginRight: '20px'
    },
    text :  {
      fontSize: '13px'
    },
    subtext: {
      //display: 'none',
      fontSize : '11px',
      fontWeight: '100',
      marginTop: '-2px',
      color: color.subTextColor,
      textTransform: 'uppercase'
    },
    speedupSvgIcon : {
      color : color.subTextColor, // color,
      height : '24px',
      width : '24px',
      //margin: '0 5px 0 5px'
    }
  }

}

function getText(torrentTableRowStore) {

  let viabilityOfPaidDownloadingTorrent = torrentTableRowStore.viabilityOfPaidDownloadingTorrent

  let text = null
  let subText = null
  let tooltip = null

  if (viabilityOfPaidDownloadingTorrent.constructor.name === 'AlreadyStarted') {
    text = "BOOSTING"
    subText = "Paying for boost"
    tooltip = "You are paying, and should now promptly be experiencing a significantly faster and more reliable downloading experience."
  }
  else if (viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart') {

    if(torrentTableRowStore.startingPaidDownload) {
      text = "STARTING BOOST"
    } else if(torrentTableRowStore.blockedStartingPaidDownloadForSwarmLatencySampling) {
      text = "OPTIMISING SPEED"
      subText = "Finding best peers"
    } else {
      text = "BOOST"
      subText="Pay for speedup"
    }

    tooltip = "By paying for a boost, you will likely experience faster download speed on this torrent."
  } else {

    text = "NO BOOST" // Paid speedup unavailable

    if(viabilityOfPaidDownloadingTorrent.constructor.name === 'WalletNotReady') {
      subText = "Wallet not ready"
      tooltip = "The wallet is still getting ready, please stand by, this should complete shortly."
    }
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'InsufficientFunds') {
      text = "BOOST AVAILABLE"
      subText = "Needs funds"
      tooltip = "The estimated minimum value of X is required to start a paid download, you only have Y currently available."
    }
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'Stopped') {
      subText = "Download stopped"
      tooltip = "You have stopped the download, start it again from toolbar on the right to allow boosting."
    }
    else if(viabilityOfPaidDownloadingTorrent.constructor.name === 'InViable') {

      if(viabilityOfPaidDownloadingTorrent.swarmViability.constructor.name === 'NoJoyStreamPeerConnections') {
        subText = "No JoyStream peers"
        tooltip = "You can only boost your download if other JoyStream compatible peers are on the same torrent swarm, which currently there are not."
      }
      else if(viabilityOfPaidDownloadingTorrent.swarmViability.constructor.name === 'NoSellersAmongJoyStreamPeers') {
        subText = "No sellers"
        tooltip = "None of the JoyStream peers are interested in buying, their are either buying or just observing."
      }
      else if(viabilityOfPaidDownloadingTorrent.swarmViability.constructor.name === 'InSufficientNumberOfSellersInvited') {
        subText = "Inviting" // Too few sellers invited
        tooltip = "Sending invitations for sellers to trade."
      }
      else if(viabilityOfPaidDownloadingTorrent.swarmViability.constructor.name === 'InSufficientNumberOfSellersHaveJoined') {
        subText = "Closing the deal" // Too few sellers have joined
        tooltip = "Still waiting for one or more sellers to join the trade."
      }
      else if(viabilityOfPaidDownloadingTorrent.swarmViability.constructor.name === 'Viable')
        assert(false, 'swarmViability is "Viable", but torrent viability was "InViable"') // <== not possible
    } else if (viabilityOfPaidDownloadingTorrent.constructor.name === 'NotLoaded') {
      assert(false, 'Media Player should not have been started for a torrent that is still loading')
    } else if (viabilityOfPaidDownloadingTorrent.constructor.name === 'FullyDownloaded') {
      assert(false, 'Media Player should not show start paid download button for a fully downloaded torrent')
    } else {
      assert(false) // <== not possible
    }
  }

  return {
    text : text,
    subText : subText,
    tooltip: tooltip
  }
}

import SvgIcon from 'material-ui/SvgIcon'

const SpeedupSvgIcon = (props) => {

  return (
    <SvgIcon viewBox={'0 0 24 24'} {...props}>
      <path d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12s12-5.383,12-12S18.617,0,12,0z M11,3h2v3h-2V3z M6,13H3v-2h3V13z M12,15c-1.654,0-3-1.346-3-3c0-0.462,0.113-0.894,0.3-1.285L4.909,6.323l1.414-1.414l4.391,4.392C11.106,9.114,11.538,9,12,9 c1.654,0,3,1.346,3,3S13.654,15,12,15z M15.536,7.05l2.121-2.121l1.414,1.414L16.95,8.464L15.536,7.05z M18,13v-2h3v2H18z"></path>
    </SvgIcon>
  )
}

const InformationSvgIcon = (props) => {
  return (
    <SvgIcon viewBox={'0 0 24 24'} {...props}>
      <path d="M12,0C5.383,0,0,5.383,0,12s5.383,12,12,12s12-5.383,12-12S18.617,0,12,0z M14.658,18.284 c-0.661,0.26-2.952,1.354-4.272,0.191c-0.394-0.346-0.59-0.785-0.59-1.318c0-0.998,0.328-1.868,0.919-3.957 c0.104-0.395,0.231-0.907,0.231-1.313c0-0.701-0.266-0.887-0.987-0.887c-0.352,0-0.742,0.125-1.095,0.257l0.195-0.799 c0.787-0.32,1.775-0.71,2.621-0.71c1.269,0,2.203,0.633,2.203,1.837c0,0.347-0.06,0.955-0.186,1.375l-0.73,2.582 c-0.151,0.522-0.424,1.673-0.001,2.014c0.416,0.337,1.401,0.158,1.887-0.071L14.658,18.284z M13.452,8c-0.828,0-1.5-0.672-1.5-1.5 s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S14.28,8,13.452,8z"></path>
    </SvgIcon>
  )
}

@observer
class StartPaidDownloadButton extends Component {

  constructor(props) {
    super(props)

    this.state = { hover : false }
  }

  handleMouseEnter = (props) => {
    this.setState({ hover : true })
  }

  handleMouseLeave = (props) => {
    this.setState({ hover : false })
  }

  handleClick = (props) => {

    if(this.props.torrentTableRowStore.viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart'
    &&
     !this.props.torrentTableRowStore.startingPaidDownload)
      this.props.torrentTableRowStore.handlePaidDownloadClick()
  }

  blocking() {
    return this.props.torrentTableRowStore.viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart'
      && (
      this.props.torrentTableRowStore.startingPaidDownload ||
      this.props.torrentTableRowStore.blockedStartingPaidDownloadForSwarmLatencySampling
    )
  }

  render() {

    let styles = getStyles(this.props, this.state)
    let texts = getText(this.props.torrentTableRowStore)

    let iconIdentifier = "svg-icon-for-" + this.props.torrentTableRowStore.torrentStore.infoHash

    return (
      <div style={styles.root}
           onClick={this.handleClick}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}

      >

        <div style={styles.iconContainer}

        >
          {
            this.blocking()
            ?
              <CircularProgress size={20} thickness={2} color={styles.colors.textColor}/>
            :
              <InformationSvgIcon style={styles.speedupSvgIcon} data-tip data-for={iconIdentifier} />
          }
        </div>

        <div style={styles.textContainer}>

          <div style={styles.text}>
            { texts.text }
          </div>

          {
            texts.subText
              ?
              <div style={styles.subtext}>{texts.subText}</div>
              :
              null
          }
        </div>

        <ReactTooltip id={iconIdentifier}
                      place='bottom'
                      effect='solid'
                      className="torrent_table_start_paid_downloading_badge_tooltip"
                      multiline={true}
        >
          {texts.tooltip}
        </ReactTooltip>


        { /**
         <div style={styles.text}>
         { texts.text.toUpperCase() }
         </div>

         {
           texts.subText
             ?
             <div style={styles.subtext}>{texts.subText}</div>
             :
             null
         }
         **/
        }

      </div>
    )
  }
}

StartPaidDownloadButton.propTypes = {
  torrentTableRowStore : PropTypes.object.isRequired // Instance of torrent store
}

const StartPaidDownloadingField = (props) => {

  let styles = {
    root : {
      flex: '0 0 220px'
    }
  }

  return (
    <Field style={styles.root}>
      <StartPaidDownloadButton torrentTableRowStore={props.torrentTableRowStore}/>
    </Field>
  )
}

StartPaidDownloadingField.propTypes = {
  torrentTableRowStore : PropTypes.object.isRequired, // TorrentTableRowStore really, but HMR breaks instanceof
}

export default StartPaidDownloadingField