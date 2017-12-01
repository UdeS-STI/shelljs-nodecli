import shell from 'shelljs'
import path from 'path'

/**
 * Check if the bin file exists.
 * @param {String} binPath Bin path.
 * @return {Boolean} True if the bin file exists.
 */
const binExist = (binPath) => {
  return shell.test('-f', binPath)
}

/**
 * Class to expose the `getPath` and the `exec` functions.
 * @class
 */
export default class ShellJSNodeCLI {
  static binPath = 'node_modules/.bin'
  static globalCLIPath = path.join(__dirname, '../../../..')
  static shell = shell

  /**
   * Gets the executable path for the Node CLI with the given name.
   * @static
   * @param {String} name The Node CLI executable name.
   * @param {String} [root=''] The root directory to start looking in.
   * @return {String} The command that will execute the CLI.
   */
  static getCommand = (name, root = '') => {
    /**
     * Search the local node_modules where the CLI is currently executed.
     */
    const localExecPath = path.join(root, ShellJSNodeCLI.binPath, name)

    if (binExist(localExecPath)) {
      return localExecPath
    }

    /**
     * Search the global node_modules of the current user.
     */
    const isGlobalPackage = shell.which(name)

    if (isGlobalPackage) {
      return name
    }

    /**
     * Search the local node_modules/.bin of the global CLI.
     */
    const globalCLIPath = path.join(ShellJSNodeCLI.globalCLIPath, ShellJSNodeCLI.binPath, name)

    if (binExist(globalCLIPath)) {
      return globalCLIPath
    }

    return ''
  }

  /**
   * Executes the given node CLI command with the specified options.
   * @static
   * @param {String} command The Node CLI command to execute.
   * @param {Object} [options] Same options as shell.exec().
   * @param {Function} [callback] The function to call when executing async.
   * @return {Object} An object containing `output` and `code` for the exit code.
   */
  static exec = (command, options, callback) => {
    const [cliName, ...commandOptions] = command.split(' ')
    const cliCommand = ShellJSNodeCLI.getCommand(cliName)

    if (cliCommand) {
      const args = [cliCommand, ...commandOptions].join(' ')
      return ShellJSNodeCLI.shell.exec.call(null, args, options, callback)
    }

    throw new Error(`Couldn't find the CLI ${cliName}.`)
  }
}
