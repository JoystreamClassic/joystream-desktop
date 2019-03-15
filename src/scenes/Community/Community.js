/**
 * Created by bedeho on 11/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react'
import opn from 'opn'

import {TELEGRAM_URL, SLACK_URL, REDDIT_URL} from '../../constants'

import IconButton from 'material-ui/IconButton'

import SlackIcon from './components/SlackIcon'
import TelegramIcon from './components/TelegramIcon'
import RedditIcon from './components/RedditIcon'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: props.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      color: 'white',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '30px',
      backgroundColor: 'hsla(219, 41%, 40%, 1)',
      padding: '10px 25px',
      borderRadius: '5px'
    },
    iconContainer: {
      display: 'flex',
      marginTop: '20px'
    },
    iconSpacer: {
      marginRight: '30px'
    },
    svgIcon: {
      width: '120px',
      height: '120px'
    },
    iconButton: {
      width: '240px',
      height: '240px',
      padding: '30px'
    }
  }
}

const Community = inject('UIStore')((props) => {
  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <div style={styles.title}>Join our community</div>
      <div style={styles.iconContainer}>

        <IconButton iconStyle={styles.svgIcon}
          style={styles.iconButton}
          onClick={() => { opn(TELEGRAM_URL).catch(() => {}) }}>
          <TelegramIcon />
        </IconButton>

        <div style={styles.iconSpacer}></div>

        <IconButton iconStyle={styles.svgIcon}
          style={styles.iconButton}
          onClick={() => { opn(SLACK_URL).catch(() => {}) }}>
          <SlackIcon />
        </IconButton>

        <div style={styles.iconSpacer}></div>

        <IconButton iconStyle={styles.svgIcon}
          style={styles.iconButton}
          onClick={() => { opn(REDDIT_URL).catch(() => {}) }}>
          <RedditIcon />
        </IconButton>

      </div>
    </div>
  )
})

Community.propTypes = {
  backgroundColor: PropTypes.string.isRequired
}

export default Community
