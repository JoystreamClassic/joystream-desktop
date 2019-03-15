/**
 * Created by bedeho on 02/10/17.
 */

import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import ElevatedAutoLitButton from '../../components/ElevatedAutoLitButton'

const ElevatedAutoLitButtonScenarios = (props) => {

    return (
        <Card style={{ padding : '40px'}}>
            <ElevatedAutoLitButton title="Lets go"
                                   onClick={() => { console.log('clicked')}}
                                   hue={200}
                                   saturation={40}
            />
        </Card>
    )
}

export default ElevatedAutoLitButtonScenarios
