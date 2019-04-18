'use strict';
const path = require('path');
const { Builder, By, Key, until } = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var assert = require("assert");

var webdrivers = require('./testlibs/fixtures/webdrivers.js');

const Sdb = require('sdb.js');
const config = require('./package.json').config;

let tv = new Sdb(config);
var webdriver_test = new webdrivers();

(async function () {
    //var driver = webdriver_test.appdriver_context(app_id, tizen_app_id);
    tv.connect();
    tv.installByFile(path.resolve(config.path));

    let info = tv.launchDebug();
    var chrome_options = new chrome.Options();
    chrome_options.options_["debuggerAddress"] = config.tv + ":" + info.port;

    var service = new chrome.ServiceBuilder(path.resolve('external/chromedriver')).build();
    var driver = chrome.Driver.createSession(chrome_options, service);

    webdriver_test.sleep(5);

    await driver.findElement(webdriver.By.css('#testsuite-menu > ul > li:nth-child(1)')).click();
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Down");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Left");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Down");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Left");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Enter");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Right");
    webdriver_test.sleep(1);
    tv.triggerRemoteController("Enter");



})().then(_ => console.log('SUCCESS'), err => console.error('ERROR: ' + err));