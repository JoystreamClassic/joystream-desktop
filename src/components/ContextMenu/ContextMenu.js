/**
 * Created by bedeho on 10/05/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

class ContextMenu extends Component {

    constructor(props) {
        super(props)
    }

    // Inspired by https://github.com/vkbansal/react-contextmenu/blob/master/src/ContextMenu.js

    menuRef = (c) => {
        this.menu = c
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick)
    }

    handleOutsideClick = (e) => {

        // If the click was outside of context menu, and
        // a handler for hiding the context menu was provided,
        // then we call it
        if (!this.menu.contains(e.target) && this.props.onOutsideContextMenuClicked) {
            this.props.onOutsideContextMenuClicked()
        }
    }

    render() {

        return (
            <div className="context-menu" ref={this.menuRef}>
                {this.props.children}
            </div>
        )
    }
}

ContextMenu.propTypes = {
    onOutsideContextMenuClicked : PropTypes.func.isRequired
}

export default ContextMenu