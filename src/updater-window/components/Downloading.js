/**
 * Created by bedeho on 09/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress'

import DialogBody,  {
    VerticalSpacer
} from './DialogBody'

const Downloading = (props) => {

    return (

        <DialogBody title="Downloading update">

            <VerticalSpacer height="30px"/>

            <CircularProgress size={100}
                              thickness={5}
                              color={'#ffffff'}
            />

        </DialogBody>
    )
}

export default Downloading