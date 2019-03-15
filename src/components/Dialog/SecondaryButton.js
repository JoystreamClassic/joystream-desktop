/**
 * Created by bedeho on 24/11/2017.
 */

import FlatButton from 'material-ui/FlatButton'

const SecondaryButton = (props) => {

  return (
    <FlatButton primary={false} disableTouchRipple={true} {...props}/>
  )
}