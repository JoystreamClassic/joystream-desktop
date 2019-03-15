/**
 * Created by bedeho on 21/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import MaterialUIDialog from 'material-ui/Dialog'

function getStyles(props) {

  return {
    dialog : {
    },
    content : {
      width : props.width
    },
    bodyStyle : {
      // actual inner content section
      padding: '0px',
      fontSize: '18px',
      fontFamily: 'Helvetica',
      backgroundColor: 'white'
    },
    title : {
      display : props.title ? 'block' : 'none',
      fontFamily : 'Helvetica neue',
      fontSize : '30px',
      fontWeight : '900',
      textAlign : 'center',
      color : 'hsla(0, 0%, 35%, 1)', //'#808080',
      backgroundColor : 'white', // <== header
      paddingTop : '40px',
      paddingBottom : '0px'
    },
    paperProps : {
      style: {
        borderRadius: '8px',
        //border : '1px solid hsla(2, 64%, 35%, 1)',
        backgroundColor: 'none', // to prevent artifact
        overflow : 'hidden',
        //boxShadow : 'none'
      },
      zDepth : 1
    }
  }
}

import ImprovedSvgIcon from '../ImprovedSvgIcon'
import IconButton from 'material-ui/IconButton'

const CloseIconButton = (props) => {

  let styles = {
    icon : {
      width : '28px',
      height : '28px',
    },
    buttonRoot : {
      right: '25px',
      top: '20px',
      position: 'absolute',
      height: 'none',
      width: 'none'
    }
  }

  let iconProps = {
    viewBox : '0 0 32 32',
    color : 'hsla(0, 0%, 80%, 1)',
    hoverColor : 'hsla(0, 0%, 60%, 1)'
  }

  return (
    <IconButton
      iconStyle={styles.icon}
      style={styles.buttonRoot}
      onClick={props.closeClick}
      disableTouchRipple={true}
    >
      <ImprovedSvgIcon {...props}
                        color={iconProps.color}
                        hoverColor={iconProps.hoverColor}
                        style={{}}
                        viewBox={iconProps.viewBox}
      >
        <path d="M28.7,7.3l-4-4c-0.4-0.4-1-0.4-1.4,0L16,10.6L8.7,3.3c-0.4-0.4-1-0.4-1.4,0l-4,4c-0.4,0.4-0.4,1,0,1.4 l7.3,7.3l-7.3,7.3c-0.4,0.4-0.4,1,0,1.4l4,4c0.4,0.4,1,0.4,1.4,0l7.3-7.3l7.3,7.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l4-4 c0.4-0.4,0.4-1,0-1.4L21.4,16l7.3-7.3C29.1,8.3,29.1,7.7,28.7,7.3z"></path>
      </ImprovedSvgIcon>
    </IconButton>
  )
}

CloseIconButton.propTypes = {
  closeClick : PropTypes.func.isRequired
}

const Dialog = (props) => {

  let styles = getStyles(props)

  return (
    <MaterialUIDialog
      {...props}
      title={props.title}
      modal={false}
      open={props.open}
      onRequestClose={props.onRequestClose}
      style={styles.dialog}
      bodyStyle={styles.bodyStyle}
      contentStyle={styles.content}
      titleStyle={styles.title}
      paperProps={styles.paperProps}
    >
      <CloseIconButton closeClick={props.onRequestClose} />
      {props.children}
    </MaterialUIDialog>
  )

}

Dialog.propTypes = {
  title : PropTypes.node,
  open : PropTypes.bool.isRequired,
  onRequestClose : PropTypes.func.isRequired,
  width : PropTypes.string.isRequired
}

export default Dialog