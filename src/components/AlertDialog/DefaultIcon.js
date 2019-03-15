import React from 'react'
import SvgIcon from 'material-ui/SvgIcon'

const DefaultIcon = (props) => {

    return (
        <SvgIcon width="48" height="48" viewBox={'0 0 48 48'}>
            <path fill="none" stroke={props.titleColor} strokeWidth="4" strokeMiterlimit="10" d="M18,34.2c0.1,3.2,2.7,5.8,6,5.8 s5.9-2.6,6-5.8" strokeLinejoin="miter" strokeLinecap="butt"></path>
            <path fill="none" stroke={props.titleColor} strokeWidth="4" strokeMiterlimit="10" d="M46,40c0-3.7-2.1-11-8-14V16 c0-7.7-6.3-14-14-14S10,8.3,10,16v10c-6,3.1-8,10.3-8,14" strokeLinejoin="miter" strokeLinecap="butt"></path>
            <ellipse fill="none" stroke={props.titleColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" cx="24" cy="40" rx="22" ry="6" strokeLinejoin="miter"></ellipse>
        </SvgIcon>
    )
}

export default DefaultIcon
