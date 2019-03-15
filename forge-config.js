 /* electron-forge config section that normally goes into package.json, can only contain JSON
  * so the config has been moved into this javascript file to add some logic, like getting some
  * config values from the environment variables
 {
   "config": {
      "forge": {

      }
   }
 }
*/

var path = require('path')

// Return a local file path to the location of the cert (PEX format)
function getSigningCertFilePath () {
  return process.env['ELECTRON_FORGE_ELECTRON_WINSTALLER_CONFIG_CERTIFICATE_FILE']
}

// Password for decrypting signing cert
function getSigningCertPassword () {
  return process.env['ELECTRON_FORGE_ELECTRON_WINSTALLER_CONFIG_CERTIFICATE_PASSWORD']
}

// Wether to do OSX code-signing
function getOsxSign () {
  return Boolean(process.env['ELECTRON_FORGE_OSX_SIGN'])
}

module.exports = {
  "make_targets": {
    "win32": [
      "squirrel"
    ],
    "darwin": [
      "dmg",
      "zip"
    ],
    "linux": [
      "deb",
      "rpm"
    ]
  },
  "electronPackagerConfig": {
    "asar": true,
    "icon": "src/assets/appicon/icon",
    "protocols" : [
      {
        "name": "BitTorrent Magnet URL",
        "schemes": [
            "magnet"
        ]
      }
    ],
    "ignore": [
      ".gitignore",
      ".travis",
      "appveyor.yml",
      "README.md",
      "deploy_scripts",
      ".idea"
    ],
    "overwrite": true,
    "appCategoryType": "public.app-category.utilities",
    "win32metadata": {
      "CompanyName": ""
    },
    "osxSign": getOsxSign()
  },
  "electronWinstallerConfig": {
    "name": "JoystreamClassic",
    //The ICO file to use as the icon for the generated Setup.exe
    "setupIcon": "src/assets/appicon/icon.ico",
    // ICO file to use as the application icon (displayed in Control Panel > Programs and Features). Defaults to the Atom icon.
    "iconUrl": "",
    "loadingGif": "src/assets/img/windows-installer-screen.png",
    "certificateFile": getSigningCertFilePath(),
    "certificatePassword": getSigningCertPassword(),
    "remoteReleases": "https://github.com/JoystreamClassic/joystream-desktop"
  },
  "electronInstallerDebian": {
    "icon": "src/assets/appicon/icon.png",
    "categories": [
      "Utility",
      "Network",
      "FileTransfer",
      "P2P"
    ],
    "mimeType": ["application/x-bittorrent", "x-scheme-handler/magnet"],
    "bin" : "Joystream",
    "desktopTemplate": path.resolve(process.cwd(), 'res/linux-desktop.ejs')
  },
  "electronInstallerDMG": {
    "background":"src/assets/img/osx-installer-screen.png",
    "icon": "src/assets/appicon/icon.png",
    "icon-size": 128,
    "format": "UDZO",
    "contents": [
    {
      x: 700,
      y: 350,
      type: 'link',
      path: '/Applications'
    },
    {
      x: 220,
      y: 350,
      type: 'file',
      path: path.resolve(process.cwd(), 'out/Joystream-darwin-x64/Joystream.app')
    }]
  },
  "github_repository": {
    "owner": "JoystreamClassic",
    "name": "joystream-desktop",
    "draft": true,
    "prerelease": false
  },
  "windowsStoreConfig": {
    "packageName": "JoystreamClassic"
  }
}
