/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */

import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import ShellJSNodeCLI from './../ShellJSNodeCLI'

chai.use(sinonChai)

describe('nodeCLI', () => {
  describe('getCommand', () => {
    it('should return the path to a CLI when there is a local module installed with a bin object', () => {
      const result = ShellJSNodeCLI.getCommand('a', 'src/test')
      const expectedResult = 'node src/test/node_modules/a/a.js'
      expect(result).to.be.equal(expectedResult)
    })

    it('should return the path to a CLI when there is a local module installed with a bin string', () => {
      const result = ShellJSNodeCLI.getCommand('b', 'src/test')
      const expectedResult = 'node src/test/node_modules/b/b.js'
      expect(result).to.be.equal(expectedResult)
    })

    it('should return an empty string when there is a local module, but it does not have a bin', () => {
      const result = ShellJSNodeCLI.getCommand('c', 'src/test')
      expect(result).to.be.equal('')
    })

    it('should return an empty string when there is no local module or global utility installed', () => {
      const result = ShellJSNodeCLI.getCommand('foo')
      expect(result).to.be.equal('')
    })

    it('should return the path to the CLI when there is a global module installed', () => {
      const result = ShellJSNodeCLI.getCommand('npm')
      expect(result).to.be.equal('npm')
    })
  })

  describe('exec', () => {
    ShellJSNodeCLI.shellJSExec = sinon.spy()

    it('should call ShellJS exec() with string arguments concatenated with spaces when called with multiple string arguments', () => {
      const command = 'npm a b c'

      ShellJSNodeCLI.exec(command)
      expect(ShellJSNodeCLI.shellJSExec).to.be.calledWith(command)
    })

    it('should call ShellJS exec() with all arguments when called with options and callback', () => {
      const command = 'npm a b'
      const options = {}
      const callback = () => {}

      ShellJSNodeCLI.exec(command, options, callback)
      expect(ShellJSNodeCLI.shellJSExec).to.be.calledWith(command, options, callback)
    })

    it("should throw an error when the Node module can't be found", () => {
      expect(() => ShellJSNodeCLI.exec('module')).to.throw(Error)
    })
  })
})
