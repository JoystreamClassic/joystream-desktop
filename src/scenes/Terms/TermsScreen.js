/**
 * Created by bedeho on 07/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import FullScreenContainer from '../../components/FullScreenContainer'

let walletSectionText = "IF YOU LOSE ACCESS TO YOUR JOYSTREAM WALLET OR YOUR PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET, YOU ACKNOWLEDGE AND AGREE THAT ANY CRYPTOCURRENCY YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the software, employees and affiliates of JoyStream, copyright holders, and JOYSTREAM, AS cannot retrieve your private keys or passwords if you lose or forget them and cannot guarantee transaction confirmation as they do not have control over the cryptocurrency network."
let limitedLiabilityText = "TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL WE, OUR AFFILIATES, SUPPLIERS OR DISTRIBUTORS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES OR ANY LOSS OF USE, DATA, BUSINESS, OR PROFITS, REGARDLESS OF LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN WARNED OF THE POSSIBILITY OF SUCH DAMAGES, AND EVEN IF A REMEDY FAILS OF ITS ESSENTIAL PURPOSE; To the fullest extent permitted by law, this software is provided “as is” and no representations or warranties can be made of any kind, express or implied, including but not limited to the warranties of merchantability, fitness or a particular purpose and noninfringement. You assume any and all risks associated with the use of the software."



const ExitButton = Radium((props) => {

  let styles = {
    exitButton : {
      height: '60px',
      fontFamily: 'Arial',
      fontSize: '20px',
      padding: '0px 30px',
      border: '1px solid rgba(161, 184, 197, 0.22)', // #A1B8C5
      borderRadius: '30px',
      color: 'rgba(161, 184, 197, 0.22)', // #A1B8C5
      backgroundColor: 'transparent',

      ':hover': {
        border: '1px solid rgba(161, 184, 197, 1)', // #A1B8C5
        color: 'rgba(161, 184, 197, 1)', // #A1B8C5
      }
    }
  }

  return (
    <button style={styles.exitButton}
            type="button"
            onClick={props.onClick}
    >
      exit
    </button>
  )

})

const AcceptButton = Radium((props) => {

  let styles = {
    acceptButton : {
      height: '60px',
      fontFamily: 'Arial',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '0px 30px',
      border: '2px solid #A1B8C5',
      borderRadius: '30px',
      color: '#A1B8C5',
      backgroundColor: 'transparent',

      ':hover': {
        backgroundColor: '#A1B8C5',
        color: 'white'
      }
    }
  }

  return (
    <button style={styles.acceptButton}
            type="button"
            onClick={props.onClick}
    >
      I accept
    </button>
  )

})

function getStyles(props) {

  return {
    root : Object.assign({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: 'center',
      height : "100%", // quick hack
      width : "100%",
      backgroundColor: 'rgb(28, 38, 43)'
    }, props.style),
    centeredContainer : {
      display : 'flex',
      flexDirection: 'column',
      border : '1px solid #283339',
      borderRadius : '10px',
      width : '600px',
      height: '600px'
    },
    titleContainer : {
      color : 'white',
      fontFamily : 'Arial',
      fontSize : '30px',
      fontWeight : 'bold',
      borderBottom : '1px solid #283339',
      width: '100%',
      padding: '30px 60px 10px 60px',
      flex: '1',
    },
    textContainer : {
      overflowX: 'hidden',
      overflowY: 'auto',
      padding : '30px 60px',
      //height : '400px',
    },
    buttonContainer : {
      display: 'flex',
      backgroundColor : 'rgba(40,51,57, 0.31)',
      width: '100%',
      padding: '30px 60px',
    },
    h2 : {
      fontFamily : 'Helvetica',
      fontSize : '20px',
      fontWeight : '600',
      color : 'rgb(161,184,197)'
    },
    p : {
      fontFamily : 'Helvetica',
      fontSize : '12px',
      color : 'rgba(161,184,197, 0.6)', // base : A1B8C5
      lineHeight : '20px',
      textAlign : 'justify'
    },
    buttonSpacer : {
      flex : '1'
    }

  }
}

const TermsScreen = (props) => {

  let styles = getStyles(props)

  let width = props.width || "554px"

  return (
    props.show
      ?
    <FullScreenContainer>
      <div style={styles.root}>

        <div style={styles.centeredContainer}>

          <div style={styles.titleContainer}>
            Terms of use
          </div>

          <div style={styles.textContainer} className="osx_scrollbar">

            <h2 style={styles.h2}>Wallet</h2>
            <p style={styles.p}>
              {walletSectionText}
            </p>

            <h2 style={styles.h2}>Limitation of Liability</h2>
            <p style={styles.p}>
              {limitedLiabilityText}
            </p>

          </div>

          <div style={styles.buttonContainer}>

            <ExitButton onClick={props.exitOnClick}/>

            <div style={styles.buttonSpacer}></div>

            <AcceptButton onClick={props.iAcceptOnClick}/>

          </div>

        </div>

      </div>
    </FullScreenContainer>
      :
    null
  )

}

TermsScreen.propTypes = {
  show : PropTypes.bool.isRequired,
  width : PropTypes.string,
  exitOnClick : PropTypes.func.isRequired,
  iAcceptOnClick : PropTypes.func.isRequired
}

export default TermsScreen