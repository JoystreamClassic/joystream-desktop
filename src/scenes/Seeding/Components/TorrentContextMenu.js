/**
 * Created by bedeho on 16/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import ContextMenu, {Separator, PauseItem, ChangePriceItem, RemoveItem, RemoveAndDeleteDataItem, SwarmItem} from '../../../components/ContextMenu/index'

const TorrentContextMenu = (props) => {
  return (
    <ContextMenu onOutsideContextMenuClicked={props.onOutsideContextMenuClicked}>

      <PauseItem {...props} />

      <ChangePriceItem {...props} />

      <Separator full />

      <RemoveItem {...props} />

      <RemoveAndDeleteDataItem {...props} />

      <Separator full />

      <SwarmItem {...props} />

    </ContextMenu>
  )
}

TorrentContextMenu.propTypes = {
  onOutsideContextMenuClicked: PropTypes.func.isRequired // whenver a click is made outside the context menu is made
}

export default TorrentContextMenu
