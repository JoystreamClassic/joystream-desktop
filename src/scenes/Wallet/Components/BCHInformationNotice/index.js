/**
 * Created by bedeho on 13/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

function getStyle(props) {

  let BCHGreen = '76,202,71'

  return {
    root : {
      display: 'flex',
      flexDirection: 'column',
      height: '470px',
      width:'450px',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      alignItems: 'center',
      boxShadow: '0px 3px #41619C'
    },
    topBar : {
      /**
      backgroundColor : 'rgb(242, 242, 242)', //'rgb(' + BCHGreen + ')',
      height : '110px',
      width: '100%'
       */
      backgroundColor : 'rgb(' + BCHGreen + ')',
      height : '8px',
      width: '100%',
      marginBottom: '100px'
    },
    logoImg : {
      src : '../src/assets/img/bitcoin-cash.png',
      paddingTop : '65px',
      width: '136px', // height will be resized automaically to maintain aspect ratio
      flex: '0 0 136px',
      position: 'relative',
      left: '157px',
      top: '0px',
    },
    textContainer : {
      fontFamily: 'Helvetica',
      fontSize: '20px',
      fontWeight: '100',
      textAlign: 'center',
      color : '#858585',
      paddingTop: '100px',
      paddingBottom: '40px',
      width: '370px'
    },
    buttonContainer : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor : 'rgb(' + BCHGreen + ')',
      flex : 1,
      width: '100%'
    }
  }
}

const AcceptButton = Radium((props) => {

  let root = {
    fontFamily: 'Arial',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '10px 25px',
    color : 'white',
    backgroundColor: '#309a2d',
    border: 'none',
    borderRadius: '4px',

    ':hover' : {
      backgroundColor: 'rgba(41, 130, 38, 1)'
    }
  }

  return (
    <button style={root}
            onClick={props.onClick}>
      Got it, lets go!
    </button>
  )

})

const InlineButton = Radium((props) => {

  let styles = {
    root : {
      backgroundColor: '#f2f2f2',
      margin: '10px',
      padding: '2px 8px',
      borderRadius: '5px',

      ':hover' : {
        backgroundColor: '#e2e2e2',
      }
    }
  }

  return (
    <span style={styles.root}
          onClick={props.onClick}
    >{props.label}
    </span>
  )
})

const BCHInformationNotice = (props) => {

  let styles = getStyle(props)

  return (
    <div style={styles.root}>

      <div style={styles.topBar}>

        <img src={styles.logoImg.src}
             style={styles.logoImg}
        />

      </div>

      <div style={styles.textContainer}>
        JoyStream uses Bitcoin Cash, a low fee and reliable cryptocurrency, read more about this crypto currency and why
        we are using it <InlineButton label="here" onClick={props.onClickWhyBCH}/>
      </div>

      <div style={styles.buttonContainer}>
        <AcceptButton onClick={props.onClick} />
      </div>

    </div>
  )
}

BCHInformationNotice.propTypes = {
  onClick : PropTypes.func.isRequired,
  onClickWhyBCH: PropTypes.func.isRequired,
}

export default BCHInformationNotice