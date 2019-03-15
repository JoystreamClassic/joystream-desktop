import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import WelcomeScreenContent from '../../scenes/Onboarding/WelcomeScreen/WelcomeScreenContent'

const Onboarding = () => {

    let style = {
        height: 600
    }

    let containerStyle = {
        height: style.height// - 100
    }

    let mockOnboardingStore = {
        skipAddingExampleTorrents : () => {
            console.log('skipAddingExampleTorrents')
        },
        acceptAddingExampleTorrents : () => {
            console.log('acceptAddingExampleTorrents')
        }
    }

    return (
        <div>
            <Card style={style} containerStyle={containerStyle}>
                <WelcomeScreenContent onboardingStore={mockOnboardingStore} />
            </Card>

            <Card style={{marginTop : '60px'}}>
            </Card>
        </div>
    )
}

export default Onboarding
