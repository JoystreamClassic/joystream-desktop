import React from 'react'
import PropTypes from 'prop-types'
import ContextMenu, { Separator, RemoveItem, RemoveAndDeleteDataItem, SwarmItem} from '../../../components/ContextMenu'

const TorrentContextMenu = (props) => {
  return (
    <ContextMenu onOutsideContextMenuClicked={props.onOutsideContextMenuClicked}>

      <RemoveItem {...props} />

      <RemoveAndDeleteDataItem {...props} />

      <Separator full />

      <SwarmItem {...props} />

    </ContextMenu>
  )
}

TorrentContextMenu.propTypes = {
  onOutsideContextMenuClicked: PropTypes.func.isRequired
}

export default TorrentContextMenu
