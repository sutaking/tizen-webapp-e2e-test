# Tizen WebApp E2E Test Example

## deps
-   [sdb.js](https://github.com/sutaking/sdb.js) :  `npm install git+https://git@github.com/sutaking/sdb.js.git#master`
-   selenium-webdriver

## Usage

`yarn start`

plz config your info on package.json like this:
````
"config": {
    "tv": "192.169.121.94",
    "user": "root",
    "pwd": "tizen",
    "host": "192.168.120.200",
    "appUUid": "3201701011486",
    "appTizenId": "zcwsruDJBm.CAPHTESTSUITEANGULAR",
    "path": "TEST_APP/3201701011486_1.0.2.wgt"
  },
````

## Example Code:
1st. Create Sdb Object to connect your tv
````javascript
const Sdb = require('sdb.js');
const config = require('./package.json').config;
let tv = new Sdb(config);
````

2nd. Connect your tv
````javascript
tv.connect();
tv.installByFile(path.resolve(config.path));

let info = tv.launchDebug();
````

3rd. launch webdirver
````javascript
var chrome_options = new chrome.Options();
chrome_options.options_["debuggerAddress"] = config.tv + ":" + info.port;

var service = new chrome.ServiceBuilder(path.resolve('external/chromedriver')).build();
var driver = chrome.Driver.createSession(chrome_options, service);
````