'use strict';
const path = require('path');
const { Builder, By, Key, until } = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var assert = require("assert");


const Sdb = require('sdb.js');
const config = require('./package.json').config;
let tv = new Sdb(config);

const sleep = function(sleep_time) {
    console.log("sleep:" + sleep_time);
    var now = new Date();
    var exitTime = now.getTime() + sleep_time*1000;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
        return;
    }
};

(async function () {
    tv.connect();
    tv.installByFile(path.resolve(config.path));

    let info = tv.launchDebug();
    var chrome_options = new chrome.Options();
    chrome_options.options_["debuggerAddress"] = config.tv + ":" + info.port;

    var service = new chrome.ServiceBuilder(path.resolve('external/chromedriver')).build();
    var driver = chrome.Driver.createSession(chrome_options, service);

    sleep(2);

    await driver.findElement(webdriver.By.css('#testsuite-menu > ul > li:nth-child(1)')).click();
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Down");
    sleep(1);
    tv.triggerRemoteController("Left");
    sleep(1);
    tv.triggerRemoteController("Down");
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Left");
    sleep(1);
    tv.triggerRemoteController("Enter");
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Right");
    sleep(1);
    tv.triggerRemoteController("Enter");



})().then(_ => console.log('SUCCESS'), err => console.error('ERROR: ' + err));