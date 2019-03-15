/**
 * Created by bedeho on 18/11/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Radium from 'radium'

import CircularProgress from 'material-ui/CircularProgress'
import ReactTooltip from 'react-tooltip'

import { Payment } from '../../../../core/Wallet'
import CashAddressFormat from '../../CashAddressFormat'
import currencyFormatter from 'currency-formatter'

const Field = (props) => {

  let styles = {
    root : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    value: {

    }
  }

  if(props.width)
    styles.root.width = props.width

  return (
    <div style={styles.root}>
      <div style={styles.value}>{props.children}</div>
    </div>
  )
}

import SvgIcon from 'material-ui/SvgIcon'

const OutboundPaymentIcon = (props) => {

  /**
  <SvgIcon {...props} viewBox="0 0 32 32">
    <polygon points="0.586,21 6,26.414 16,16.414 26,26.414 31.414,21 16,5.586 "></polygon>
  </SvgIcon>
*/

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" cx="16" cy="16" r="15" strokeLinejoin="miter"></circle>
      <line fill="none" stroke={props.strokeColor} strokeWidth="2" strokeMiterlimit="10" x1="16" y1="25" x2="16" y2="7" strokeLinejoin="miter" strokeLinecap="butt"></line>
      <polyline fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" points=" 9,14 16,7 23,14 " strokeLinejoin="miter"></polyline>
    </SvgIcon>
  )
}

const InboundPaymentIcon = (props) => {

  /**
  <SvgIcon {...props}  viewBox="0 0 32 32">
    <polygon points="26,5.586 16,15.586 6,5.586 0.586,11 16,26.414 31.414,11 "></polygon>
  </SvgIcon>
*/

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" cx="16" cy="16" r="15" strokeLinejoin="miter"></circle>
      <line fill="none" stroke={props.strokeColor} strokeWidth="2" strokeMiterlimit="10" x1="16" y1="7" x2="16" y2="25" strokeLinejoin="miter" strokeLinecap="butt"></line>
      <polyline fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" points=" 23,18 16,25 9,18 " strokeLinejoin="miter"></polyline>
    </SvgIcon>
  )
}

const CompletedIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <polyline fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" points=" 9,17 13,21 23,11 " strokeLinejoin="miter"></polyline>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" cx="16" cy="16" r="15" strokeLinejoin="miter"></circle>
    </SvgIcon>
  )
}

const PendingIcon = (props) => {

  return (
    <SvgIcon viewBox={"0 0 32 32"} style={props.style}>
      <path data-cap="butt" fill="none" stroke={props.strokeColor} strokeWidth="2" strokeMiterlimit="10" d="M29,16c0,7.2-5.8,13-13,13 S3,23.2,3,16S8.8,3,16,3c5.2,0,9.8,3.1,11.8,7.6" strokeLinejoin="miter" strokeLinecap="butt"></path>
      <polyline fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" points="28.9,3 27.9,10.7 20.2,9.7 " strokeLinejoin="miter"></polyline>
      <polyline fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" points=" 16,10 16,16 10,16 " strokeLinejoin="miter"></polyline>
    </SvgIcon>
  )
}

function getStyles(props, state) {

  return {
    root: {
      display : 'flex',
      flexDirection : 'row',
      flex : '0 0 90px',
      //backgroundColor : state.hover ? 'hsla(218, 42%, 90%, 1)' : props.backgroundColor,
      backgroundColor : 'hsl(219, 41%, 100%)', //props.backgroundColor,
      fontFamily : 'Helvetica',

      justifyContent: 'center' //'flex-start'
    },
    dateField : {
      display: 'flex',
      flex : '0 0 40px',
      marginRight: '40px',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dateContainer : {
      display : 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      top: '7px'
    },
    month : {
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color : 'rgb(120, 149, 207)'
    },
    day : {
      fontSize : '20px',
      fontFamily: 'Helvetica',
      fontWeight: '100',
      position: 'relative',
      top: '-5px',
      color : 'rgb(59, 96, 170)'
    },
    paymentTypeField : {
      flex : '0 0 40px',
      display : 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    descriptionField : {
      //flexGrow : '1',
      flex : '0 0 350px', // 385
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      color : 'lightgrey',
      fontSize : '16px',
      paddingLeft : '40px'
    },
    paymentDirectionValue : {
      fontSize: '14px',
      color: 'hsla(220, 47%, 64%, 1)',
      fontWeight : 'bold',
      textTransform: 'uppercase'
    },
    toAddressValue : {
      marginLeft : '4px',
      color: 'rgb(149, 149, 150)',
      userSelect: 'text',
      //backgroundColor: 'rgba(128, 156, 210, 0.1)',
      //paddingLeft: '4px',
      //paddingRight: '4px',
      //borderRadius: '2px'
    },
    confirmationStatusField : {
      display: 'flex',
      flex : '0 0 80px',
      alignItems : 'center',
      justifyContent : 'center'
    },
    circularProgress : {
      height: '32px',
      width: '32px'
    },
    amountField : {
      //flex : '0 0 210px',
      //paddingLeft: '40px',
      display: 'flex',
      flexDirection: 'column',
      flex : '0 0 160px',
      alignItems: 'flex-end',
      justifyContent: 'center',
      color : 'hsla(220, 48%, 45%, 1)',
    },
    amount : {
      fontSize : '22px',
      fontFamily: 'Helvetica',
      fontWeight: '200'
    },
    amountUnit : {
      fontSize : '14px',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      marginRight: '5px',
      color: 'rgb(180, 196, 229)'
    },
    amountFiat: {
      color: 'rgb(149, 149, 150)',
      fontSize: '14px',
      marginTop: '-6px'
    },
    confirmationStatus : {
      backgroundColor : 'hsla(240, 0%, 79%, 1)',
      color : 'hsla(0, 0%, 47%, 1)',
      borderRadius : '3px',
      padding : '3px 5px 1px 5px',
      fontSize : '12px',
      textTransform : 'uppercase',
      fontWeight : 'bold',
      //width : '80px',
      textAlign : 'center'
    },
    openButtonField : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      paddingLeft : '40px'
    }
  }
}

const OpenIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 48 48" style={props.style}>
      <path fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" d="M4,24c0,0,7.9-14,20-14 c12,0,20,14,20,14s-8.1,14-20,14C12,38,4,24,4,24z" strokeLinejoin="miter"></path>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="2" strokeLinecap="square" strokeMiterlimit="10" cx="24" cy="24" r="7" strokeLinejoin="miter"></circle>
    </SvgIcon>
  )
}

const UnconfirmedTransactionIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <path fill={props.strokeColor} d="M4,16C4,9.383,9.383,4,16,4c2.377,0,4.657,0.696,6.603,1.983l-3.724,3.724l10.3,1.472l-1.472-10.3l-3.672,3.672C21.693,2.903,18.911,2,16,2C8.28,2,2,8.28,2,16c0,0.552,0.448,1,1,1S4,16.552,4,16z"></path>
      <path fill={props.strokeColor} d="M29,15c-0.552,0-1,0.448-1,1c0,6.617-5.383,12-12,12c-2.377,0-4.657-0.696-6.603-1.983l3.724-3.724l-10.3-1.472l1.472,10.3l3.672-3.672C10.307,29.097,13.089,30,16,30c7.72,0,14-6.28,14-14C30,15.448,29.552,15,29,15z"></path>
    </SvgIcon>
  )
}

const Button = Radium((props) => {

  let color = 'rgb(180, 196, 229)'
  let colorActive = 'rgb(59, 96, 170)'

  let styles = {
    button : {
      border: '2px solid ' + color,
      borderRadius: '30px',
      color: color,
      width: '60px',
      height: '30px',
      backgroundColor: 'transparent',
      fontSize: '13px',
      fontWeight: 'bold',

      ':hover' : {
        backgroundColor: color,
        color : 'white',
      },

      ':active' : {
        backgroundColor : colorActive,
        border : '1px solid ' + colorActive,
        color : 'white'
      }
    },


  }

  return (
    <input type="submit"
            value={"view"}
            style={styles.button}
            onClick={props.onClick}
    >
    </input>
  )
})

@observer
class PaymentRow extends Component {

  constructor(props) {
    super(props)

    this.state = { hover : false}
  }

  handleMouseEnter = () => {
    this.setState({ hover : true})
  }

  handleMouseLeave = () => {
    this.setState({ hover : false})
  }

  render() {

    let styles = getStyles(this.props, this.state)

    let date = this.props.paymentRowStore.date
    let paymentStore = this.props.paymentRowStore.paymentStore

    let s = (new CashAddressFormat(paymentStore.toAddress)).toString()

    return (
      <div style={styles.root}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
      >

        <div style={styles.dateField}>
          <div style={styles.dateContainer}>
            <div style={styles.month}>{date ? toMonthString(date.getMonth()) : null}</div>
            <div style={styles.day}>{date ? date.getDate() : null}</div>
          </div>
        </div>

        <div style={styles.paymentTypeField}>
          {
            paymentStore.type === Payment.TYPE.INBOUND
              ?
            <InboundPaymentIcon style={{ height : '32px', width : '32px'}} strokeColor={'#8bc34a'}/>
              :
            <OutboundPaymentIcon style={{ height : '32px', width : '32px'}} strokeColor={'rgb(220, 53, 69)'}/>
          }
          {
            /** rgb(180, 196, 229) **/
           }
        </div>

        <div style={styles.descriptionField}>

          <div style={styles.paymentDirectionValue}>
            {
              paymentStore.type === Payment.TYPE.INBOUND
                ?
                "Incoming payment"
                :
                "Outgoing payment"
            }
          </div>

          <div style={{display : 'flex', fontSize : '13px', color : 'rgb(129, 129, 130)'}}>

            <span>
              to
            </span>

            <span style={styles.toAddressValue}>
              {(new CashAddressFormat(paymentStore.toAddress)).toString().split(':')[1]}
            </span>
          </div>

          { /** paymentStore.note **/ }

        </div>


        <div style={styles.confirmationStatusField}
             id={this.props.paymentId + "confirmationStatusField"}>

          {
            paymentStore.confirmed
              ?

              <CompletedIcon style={{ height : '32px', width : '32px'}}
                             strokeColor={'rgb(180, 196, 229)'}/>
              :
              <UnconfirmedTransactionIcon style={styles.circularProgress}
                                          strokeColor={'hsla(220, 48%, 45%, 1)'}
              />
                /**
              <CircularProgress color={'hsla(220, 48%, 45%, 1)'}
                                size={32}
                                style={styles.circularProgress}
              />**/
          }

          { /*
          <ReactTooltip id={this.props.paymentId + "confirmationStatusField"}
                        place='top'
                        effect='solid'
                        className="torrent_table_toolbar_tooltip">
            {
              paymentStore.confirmed
                ?
              "Finalized payment"
                :
              "Pending payment"
            }
          </ReactTooltip>
          */
          }

        </div>

        <div style={styles.amountField}>

            <span style={styles.amount}>
              <span style={styles.amountUnit}>BCH</span>
              {(paymentStore.amount/100000000).toFixed(8)}
            </span>

            <span style={styles.amountFiat}>
              { currencyFormatter.format(this.props.paymentRowStore.amountInFiat, { code: 'USD', precision: 4 }) }
            </span>

        </div>

        <div style={styles.openButtonField}>

         <Button onClick={() => { this.props.paymentRowStore.click()}}/>

          {/** <OpenIcon style={{ height : '48px', width : '48px'}}  strokeColor={"rgb(180, 196, 229)"} /> **/}

        </div>


      </div>
    )

  }
}

PaymentRow.propTypes = {
  paymentRowStore : PropTypes.object.isRequired, // PaymentStore instance
  paymentId : PropTypes.string.isRequired,
  backgroundColor : PropTypes.string.isRequired,
}

function toMonthString(monthId) {

  let monthString

  switch(monthId) {
    case 0:
      monthString = 'Jan'
      break
    case 1:
      monthString = 'Feb'
      break
    case 2:
      monthString = 'Mar'
      break
    case 3:
      monthString = 'Apr'
      break
    case 4:
      monthString = 'May'
      break
    case 5:
      monthString = 'Jun'
      break
    case 6:
      monthString = 'Jul'
      break
    case 7:
      monthString = 'Aug'
      break
    case 8:
      monthString = 'Sep'
      break
    case 9:
      monthString = 'Oct'
      break
    case 10:
      monthString = 'Nov'
      break
    case 11:
      monthString = 'Dec'
      break
    default:
      assert(false)
  }

  return monthString
}

export default PaymentRow
