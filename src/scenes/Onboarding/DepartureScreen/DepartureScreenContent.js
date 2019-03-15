/**
 * Created by bedeho on 06/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import {InnerDialogHeading, TransparentButton} from '../../../components/FullScreenDialog'
import ElevatedAutoLitButton from '../../../components/ElevatedAutoLitButton'
import SvgIcon from 'material-ui/SvgIcon'

function getStyles(props) {

    return {
        container : {
            display : 'flex',
            flexDirection : 'column',
            alignItems: 'center'
        },
        subtitle : {
            padding : '20px',
            textAlign: 'center',
            marginTop: '30px',
            width: '800px'
        },
        buttonContainer : {
            display : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px'
        },
        buttonSpacer : {
            width: '100px',
            display: 'flex',
            justifyContent :'center',
            alignItems: 'center',
            fontSize: '24px',
            fontStyle: 'italic'
        },
        exampleContainer : {
            display: 'flex',
            marginTop: '20px'
        },
        icon : {
            height : '130px',
            width : '130px'
        }
    }
}

const ReloadSvgIcon = (props) => {

    return (
        <SvgIcon {...props}>
            <path fill="#335262" d="M24,6c5.54071,0,10.63733,2.49341,14.0119,6.68988l-7.65057-1.02484l-0.53125,3.96484l11.89355,1.59326 c0.08887,0.01172,0.17773,0.01758,0.26562,0.01758c0.43652,0,0.86328-0.14258,1.21387-0.41064 c0.42188-0.32178,0.69824-0.79834,0.76855-1.32373L45.56445,3.6123l-3.96484-0.53125l-0.88593,6.61633 C36.59375,4.86322,30.5556,2,24,2C11.86914,2,2,11.86914,2,24h4C6,14.07471,14.0752,6,24,6z"></path>
            <circle fill="#43A6DD" cx="24" cy="24" r="7"></circle>
            <path fill="#335262" d="M4.79688,31.16992C4.375,31.4917,4.09863,31.96826,4.02832,32.49365L2.43555,44.3877l3.96484,0.53125 l0.88593-6.61633C11.40625,43.13678,17.4444,46,24,46c12.13086,0,22-9.86914,22-22h-4c0,9.92529-8.0752,18-18,18 c-5.54071,0-10.63733-2.49341-14.0119-6.68988l7.65057,1.02484l0.53125-3.96484L6.27637,30.77686 C5.74707,30.70752,5.21777,30.84766,4.79688,31.16992z"></path>
        </SvgIcon>
    )
}

const DepartureScreenContent = (props) => {

    let styles = getStyles(props)

    return (
        <InnerDialogHeading title="Auto updates coming!">

            <div style={styles.container}>

                <div style={styles.subtitle}>
                    Check back, we make new releases roughly every <span style={{fontWeight : 'bold'}}>10 days</span>, updates are automatically installed when you run JoyStream.
                </div>

                <div style={styles.exampleContainer}>

                    <ReloadSvgIcon viewBox="0 0 48 48" style={styles.icon}/>

                </div>

                <div style={styles.buttonContainer}>

                    <ElevatedAutoLitButton title={"Ok, close JoyStream!"}
                                           onClick={() => { props.onboardingStore.shutDownMessageAccepted() }}
                                           hue={212}
                                           saturation={100}
                                           height={70}
                                           width={350}
                    />

                </div>

            </div>

        </InnerDialogHeading>
    )
}

DepartureScreenContent.propTypes = {
    onboardingStore : PropTypes.object.isRequired,
}

export default DepartureScreenContent