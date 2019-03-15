var machina = require('machina')

var BaseMachine = machina.BehavioralFsm.extend({

  initialize: function (options) {
    if (typeof this.initializeMachine === 'function') {
      this.initializeMachine(options)
    }

    this.linkChildren()
  },

  linkChildren () {
    // iterate over states, for each _child instance set its parent_machine to this machine
    for(var s in this.states) {
      let state = this.states[s]
      if (state._child) {
        if (typeof state._child === 'object' && state._child.factory != 'function') {
          state._child.parent_machine = this
        } else {
          throw new Error('BaseMachine only supports instances of child submachines')
        }
      }
    }
  },

  // Helper method to do a 'deep transition' across the state machines tree
  // on a relative path starting at the current machine
  go: function (client, relativePath) {
    if(typeof relativePath === 'string') {
      relativePath = relativePath.split('/')
    }

    if(!relativePath.length) return

    relativePath = relativePath.slice()

    var state = relativePath.shift()

    var machine

    if (state === '..') {
      machine = this.parent_machine
      if (relativePath.length === 0) {
        // transition to initialState of parent machine if no explicit state supplied
        machine = machine.instance || machine
        relativePath = [machine.initialState]
      }
    } else {
      this.transition(client, state)
      machine = this.states[state]._child
      if (!machine && relativePath.length) throw new Error('no child substate exists to complete transition')
    }

    if (machine && relativePath.length) {
      machine = machine.instance || machine
      machine.go(client, relativePath)
    }
  },

  queuedHandle: function () {
    this._handleQueue = this._handleQueue || []

    if (this._priorQueuedHandleCallActive) {
      this._handleQueue.push(arguments)
    } else {
      this._priorQueuedHandleCallActive = true
      this.handle.apply(this, arguments)

      while(this._handleQueue.length) {
        var args = this._handleQueue.shift()
        this.handle.apply(this, args)
      }

      this._priorQueuedHandleCallActive = false
    }
  }
})

module.exports = BaseMachine
