/**
 * Created by bedeho on 06/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import {InnerDialogHeading, TransparentButton} from '../../../components/FullScreenDialog'
import ElevatedAutoLitButton from '../../../components/ElevatedAutoLitButton'
import ExampleTorrent from './ExampleTorrent'

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
            marginTop: '30px'
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
        }
    }
}

const ExampleSpacer = (props) => {

    let style = {
        width : '30px'
    }

    return (
        <div style={style}></div>
    )
}

const WelcomeScreenContent = (props) => {

    let styles = getStyles(props)

    let imageDimensionProps = {
        imageHeight : 1000/4,
        imageWidth : 670/4
    }

    return (
        <InnerDialogHeading title="Get Started!">

            <div style={styles.container}>

                <div style={styles.subtitle}>
                    Try out these of creative commons movies from the Blender Foundation.
                </div>

                <div style={styles.exampleContainer}>

                    <ExampleTorrent title={"Sintel"}
                                    byteSize={1024*1024*123}
                                    imageSrc="../src/assets/img/exampleTorrents/sintel.jpg"
                                    {...imageDimensionProps}
                    />

                    <ExampleSpacer />

                    <ExampleTorrent title={"Glass half full"}
                                    byteSize={1024*1024*26}
                                    imageSrc="../src/assets/img/exampleTorrents/glass-half-full.jpg"
                                    {...imageDimensionProps}
                    />

                    <ExampleSpacer />

                    <ExampleTorrent title={"Cosmos Laundromat"}
                                    byteSize={1024*1024*211}
                                    imageSrc="../src/assets/img/exampleTorrents/cosmos.jpg"
                                    {...imageDimensionProps}
                    />

                    <ExampleSpacer />

                    <ExampleTorrent title={"Big Buck Bunny"}
                        byteSize={1024*1024*264}
                        imageSrc="../src/assets/img/exampleTorrents/big-buck-bunny.jpg"
                        {...imageDimensionProps}
                    />

                    <ExampleSpacer />

                    <ExampleTorrent title={"Elephants Dream"}
                        byteSize={1024*1024*425}
                        imageSrc="../src/assets/img/exampleTorrents/elephants-dream.jpg"
                        {...imageDimensionProps}
                    />

                    <ExampleSpacer />

                    <ExampleTorrent title={"Tears of Steel"}
                         byteSize={1024*1024*545}
                         imageSrc="../src/assets/img/exampleTorrents/tears-of-steel.jpg"
                         {...imageDimensionProps}
                    />

                </div>

                <div style={styles.buttonContainer}>

                    {
                      /**

                    <TransparentButton label="No thank you"
                                       onClick={() => {
                                         props.onboardingStore.skipAddingExampleTorrents()
                                       }}
                    />

                    < div style={styles.buttonSpacer}>
                    <span>or</span>
                    </div>

                       **/
                    }

                    <ElevatedAutoLitButton title={"Lets go!"}
                                           onClick={() => { props.onboardingStore.acceptAddingExampleTorrents() }}
                                           hue={212}
                                           saturation={100}
                                           height={70}
                                           width={200}
                    />

                </div>

            </div>

        </InnerDialogHeading>
    )
}

WelcomeScreenContent.propTypes = {
    onboardingStore : PropTypes.object.isRequired,
}

export default WelcomeScreenContent
