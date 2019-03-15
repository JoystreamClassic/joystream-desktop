/**
 * Created by bedeho on 10/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../../../components/Header'

const UploadButton = (props) => {

    return (
        <Button title="Uploads" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M12.8,5.4c-0.377-0.504-1.223-0.504-1.6,0l-9,12c-0.228,0.303-0.264,0.708-0.095,1.047 C2.275,18.786,2.621,19,3,19h18c0.379,0,0.725-0.214,0.895-0.553c0.169-0.339,0.133-0.744-0.095-1.047L12.8,5.4z"></path>
        </Button>
    )
}

const DowloadButton = (props) => {

    return (
        <Button title="Downloads" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M21,5H3C2.621,5,2.275,5.214,2.105,5.553C1.937,5.892,1.973,6.297,2.2,6.6l9,12 c0.188,0.252,0.485,0.4,0.8,0.4s0.611-0.148,0.8-0.4l9-12c0.228-0.303,0.264-0.708,0.095-1.047C21.725,5.214,21.379,5,21,5z"></path>
        </Button>
    )
}

const FinishedButton = (props) => {

    return (
        <Button title="Finished" {...props}
                viewBox={'0 0 24 24'}>
            <polygon points="9,20 2,13 5,10 9,14 19,4 22,7 "></polygon>
        </Button>
    )
}

const WalletButton = (props) => {

    return (
        <Button title="Wallet" {...props}
                viewBox={'0 0 24 24'}>

            <g className="nc-icon-wrapper" >
                <rect x="6"  width="16" height="4"></rect>
                <path d="M23,6H3C2.449,6,2,5.551,2,5s0.449-1,1-1h1V2H3C1.343,2,0,3.343,0,5v15c0,2.209,1.791,4,4,4h19 c0.552,0,1-0.448,1-1V7C24,6.448,23.552,6,23,6z M18,17c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2 C20,16.105,19.105,17,18,17z"></path>
            </g>
        </Button>
    )
}

const CommunityButton = (props) => {

    return (
        <Button title="Community" {...props}
                viewBox={'0 0 24 24'}>

            <g className="nc-icon-wrapper" >
                <path d="M12,6L12,6c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,4.657,13.657,6,12,6z"></path>
                <path d="M4,19v-8c0-1.13,0.391-2.162,1.026-3H2c-1.105,0-2,0.895-2,2v6h2v5c0,0.552,0.448,1,1,1h2 c0.552,0,1-0.448,1-1v-2H4z"></path>
                <path d="M14,24h-4c-0.552,0-1-0.448-1-1v-6H6v-6c0-1.657,1.343-3,3-3h6c1.657,0,3,1.343,3,3v6h-3v6 C15,23.552,14.552,24,14,24z"></path>
                <path d="M4,7L4,7C2.895,7,2,6.105,2,5v0c0-1.105,0.895-2,2-2h0c1.105,0,2,0.895,2,2v0 C6,6.105,5.105,7,4,7z"></path>
                <path d="M20,19v-8c0-1.13-0.391-2.162-1.026-3H22c1.105,0,2,0.895,2,2v6h-2v5c0,0.552-0.448,1-1,1h-2 c-0.552,0-1-0.448-1-1v-2H20z"></path>
                <path d="M20,7L20,7c1.105,0,2-0.895,2-2v0c0-1.105-0.895-2-2-2h0c-1.105,0-2,0.895-2,2v0 C18,6.105,18.895,7,20,7z"></path>
            </g>

        </Button>
    )
}

const LivestreamButton = (props) => {

    return (
        <Button title="Live" {...props}
                viewBox={'0 0 24 24'}>
            <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"></path>
        </Button>
    )
}

const NewButton = (props) => {

    return (
        <Button title="New" {...props}
                viewBox={'0 0 24 24'}>
            <g className="nc-icon-wrapper">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z"></path>
            </g>
        </Button>
    )
}

const PublishButton = (props) => {

    return (
        <Button title="Publish" {...props}
                viewBox={'0 0 24 24'}>
            <g className="nc-icon-wrapper">
                <polygon points="12,0 24,7 12,14 0,7 "></polygon>
                <polygon points="12,21.315 2.301,15.658 0,17 12,24 24,17 21.699,15.658 "></polygon>
                <polygon points="12,16.315 2.301,10.658 0,12 12,19 24,12 21.699,10.658 "></polygon>
            </g>
        </Button>
    )
}

const SettingsButton = (props) => {

  return (
    <Button title="Settings" {...props}
            viewBox={'0 0 24 24'}>
      <path d="M5,13L5,1c0-0.552-0.448-1-1-1S3,0.448,3,1l0,12H5z"></path>
      <path d="M7,15H1c-0.552,0-1,0.448-1,1v4c0,0.552,0.448,1,1,1h2v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2h2 c0.552,0,1-0.448,1-1v-4C8,15.448,7.552,15,7,15z"></path>
      <path d="M13,3l0-2c0-0.552-0.448-1-1-1s-1,0.448-1,1l0,2H13z"></path>
      <path d="M16,6c0-0.552-0.448-1-1-1H9C8.448,5,8,5.448,8,6v4c0,0.552,0.448,1,1,1h2v12 c0,0.552,0.448,1,1,1s1-0.448,1-1V11h2c0.552,0,1-0.448,1-1V6z"></path>
      <path d="M21,13l0-12c0-0.552-0.448-1-1-1s-1,0.448-1,1l0,12H21z"></path>
      <path d="M23,15h-6c-0.552,0-1,0.448-1,1v4c0,0.552,0.448,1,1,1h2v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2h2 c0.552,0,1-0.448,1-1v-4C24,15.448,23.552,15,23,15z"></path>
    </Button>
  )

}

export {
    UploadButton,
    DowloadButton,
    FinishedButton,
    WalletButton,
    CommunityButton,
    LivestreamButton,
    NewButton,
    PublishButton,
    SettingsButton
}