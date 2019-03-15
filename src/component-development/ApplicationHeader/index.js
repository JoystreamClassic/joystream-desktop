/**
 * Created by bedeho on 20/08/17.
 */

/**
 * Created by bedeho on 29/05/17.
 */

import React from 'react'
import {ScenarioContainer} from '../common'
import ApplicationHeader from '../../scenes/Application/components/ApplicationHeader'

const ApplicationHeaderScenarios = (props) => {

    return (
        <ScenarioContainer title="Basic sidebar">
            <ApplicationHeader app={props.store} />
        </ScenarioContainer>
    )
}

export default ApplicationHeaderScenarios
