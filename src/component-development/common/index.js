/**
 * Created by bedeho on 29/05/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const ScenarioContainer = (props) => {

    let style = Object.assign({paddingBottom : 40}, props.style)

    return (
        <Card style={style}>
            <CardTitle title={props.title} subtitle={props.subtitle} />
            {props.children}
        </Card>
    )
}

ScenarioContainer.propTypes = {
    style : PropTypes.object
}

export {ScenarioContainer}