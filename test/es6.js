import { assert, expect } from 'chai'

import net from 'net'

class C {
  constructor () {}
}

describe('ES6 support', function () {

  it('class, arrow functions', function () {
    // const keyword and arrow function
    const f = () => {}
    expect(f).to.be.an('function')

    assert(net)

    let c = new C()
    assert(c)
  })

  it('async/await', async function () {
    function func () {
      return Promise.resolve('done')
    }

    let value = await func()

    assert.equal(value, 'done')
  })
})
