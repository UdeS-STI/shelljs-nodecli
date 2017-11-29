import fs from 'fs'
import shell from 'shelljs'
import path from 'path'

/**
 * Retrieves a binary from the given package.
 * @param {Object} pkg The node package.json file content.
 * @param {String} name The binary name to look for.
 * @return {String} The path to the binary.
 * @private
 */
function getBin (pkg, name) {
  if (pkg) {
    if (typeof pkg.bin === 'string' && pkg.name === name) {
      return pkg.bin
    } else if (typeof pkg.bin === 'object') {
      return pkg.bin[name]
    }
  }

  return null
}

/**
 * Retrieves package information for the given Node module.
 * @param {String} packagePath The name of the Node module to retrieve the package for.
 * @return {Object} The content of the package.json file for the Node module .
 * @private
 */
const getPackage = (packagePath) => {
  const content = fs.readFileSync(packagePath, 'utf8')
  return JSON.parse(content)
}

/**
 * Return the package path.
 * @param {String} name The name of the Node module to retrieve the package for.
 * @param {String} [root=''] The root directory to start looking in.
 * @return {String} Package path.
 */
const getPackagePath = (name, root = '') => {
  return path.join(root, 'node_modules', name, 'package.json')
}

/**
 * Check if the package exists.
 * @param {String} packagePath
 * @return {Boolean} True if the package file exists.
 */
const existPackagePath = (packagePath) => {
  return shell.test('-f', packagePath)
}

const getLocalPath = (name, root = '') => {
  const localPackagePath = getPackagePath(name, root)
  const isLocalPackage = existPackagePath(localPackagePath)

  if (isLocalPackage) {
    const localPackage = getPackage(localPackagePath)
    const bin = getBin(localPackage)

    if (bin) {
      return getLocalExecPath(name, root, bin)
    }
  }

  return null
}

/**
 * Class to expose the `getPath` and the `exec` functions.
 * @class
 */
export default class ShellJSNodeCLI {
  /**
   * Gets the executable path for the Node CLI with the given name.
   * @param {String} name The Node CLI executable name.
   * @param {String} [root=''] The root directory to start looking in.
   * @return {String} The command that will execute the CLI.
   */
  getCommand = (name, root = '') => {
    /**
     * Search the local node_modules where the CLI is currently executed.
     */
    const localExecPath = getLocalPath(name, root)

    if (localExecPath) {
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
     * Search the local node_modules of the global CLI.
     */
    const globalCLIPath = path.join(__dirname, '../../..')
    const globalLocalExecPath = getLocalPath(name, globalCLIPath)

    if (globalLocalExecPath) {
      return globalLocalExecPath
    }

    return null
  }
}
