var assert = require('chai').assert
var expect = require('chai').expect
var sinon = require('sinon')
var _ = require('lodash')

var BaseMachine = require('../../../src/core/BaseMachine')

var machine = require('./complex_machine')

describe('Base State Machine', function () {
  describe('supports deep tree transitions', function () {
    var machine = require('./complex_machine')

    it('has go method', function () {
      expect(machine.go).to.be.a('function')
    })

    it('transitions', function () {
      function assertCompositeState (machine, client, state) {
        assert.equal(machine.compositeState(client), state)
      }

      // Get instance of state machine for active substate.
      // compositeState separates states with a period (.)
      // so this function will break if states have a period in their names
      function getActiveStateMachine (machine, client) {
        let compositeState = machine.compositeState(client).split('.')

        compositeState.forEach(function (state) {
          machine = machine.states[state]._child || machine
          machine = machine.instance || machine
        })

        return machine
      }

      function deepTransition (machine, client, path) {
        getActiveStateMachine(machine, client).go(client, path)
      }

      let client = {}

      const assertState = assertCompositeState.bind(null, machine, client)

      const transition = deepTransition.bind(null, machine, client)

      assertState('X.a.A')

      transition(['..', 'b'])

      assertState('X.b')

      transition(['..', 'Y'])

      assertState('Y')

      transition(['X', 'a', 'A'])

      assertState('X.a.A')

      transition('../b')

      assertState('X.b')
    })
  })

  describe('queuedHandle', function () {
    var machine = new BaseMachine({
      states: {
        uninitialized: {
        }
      }
    })

    it('has queuedHandle method', function () {
      expect(machine.queuedHandle).to.be.a('function')
    })

    it('immediately handles input if no other handler executing', function () {
      var client = {}
      var spy = sinon.spy()
      machine.states['uninitialized'].spy = spy
      machine.queuedHandle(client, 'spy', 'arg1', 'arg2')

      assert(Array.isArray(machine._handleQueue))
      assert(spy.called)
      assert(spy.calledWith(client, 'arg1', 'arg2'))
    })

    it('queues handlers', function(){
      var client = {}

      var spy = sinon.spy()

      machine.states['uninitialized'].spy = spy

      var reentry = sinon.spy(function(client) {
        // as we are currently handling an input, the next call should get queued
        this.queuedHandle(client, 'spy', 'arg1', 'arg2')
        // if handler was successfully queued spy should not have been called yet
        assert(!spy.called)
      })

      machine.states['uninitialized'].reentry = reentry

      machine.queuedHandle(client, 'reentry')

      // make sure that the last handler was called
      assert(reentry.called)

      // ensure queued handler was dequed and called with correct arguments
      assert(spy.calledWith(client, 'arg1', 'arg2'))
    })
  })
})
