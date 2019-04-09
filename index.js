'use strict';
const {Builder, By, Key, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver');
var assert = require("assert");

var webdrivers = require('./testlibs/fixtures/webdrivers.js');
var tizen = require('./testlibs/tizen/tizen.js');
var tv_key =  require('./tv_keys.js');

var tizen_test = new tizen();
var webdriver_test=new webdrivers();
var tvkey = new tv_key();

var app_id = "3201701011486";
var tizen_app_id = "zcwsruDJBm.CAPHTESTSUITEANGULAR";

(async function() {
    var driver = webdriver_test.appdriver_context(app_id, tizen_app_id);
    webdriver_test.sleep(5);
 
    //login
    /*for(let i=1; i<=10; i++) {
        await driver.findElement(webdriver.By.css(`#testsuite-menu > ul > li:nth-child(${i})`)).click();
        webdriver_test.sleep(2);
    }*/
    
    await driver.findElement(webdriver.By.css('#testsuite-menu > ul > li:nth-child(1)')).click();
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.DOWN);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.LEFT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.DOWN);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.LEFT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.OK);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.RIGHT);
    webdriver_test.sleep(1);
    tizen_test.input_key(tvkey.OK);
    /*for(let i=1; i<=9; i++) {
        await driver.findElement(webdriver.By.css(`#depth0 > div:nth-child(${i})`));
        webdriver_test.sleep(2);
    }*/
    
    /*await driver.findElement(webdriver.By.css('.setting')).click();
    webdriver_test.sleep(5);
    await driver.findElement(webdriver.By.css('#subMenu25 > .ndiv')).click();
    webdriver_test.sleep(5);
    await driver.findElement(webdriver.By.css('#inputLoginId')).sendKeys(accounts.pooq.username);
    await driver.findElement(webdriver.By.css('#inputLoginPwd')).sendKeys(accounts.pooq.password);
    await driver.findElement(webdriver.By.css('.loginBtn')).click();
    webdriver_test.sleep(5);
    //check text01
    let text01 = await driver.findElement(webdriver.By.css('.text01')).getText();
    assert.equal(text01,'로그인을 성공하였습니다.');
    webdriver_test.sleep(5);
    //click text01 OK
    await driver.findElement(webdriver.By.css('.popupBtnArea > .pbtn01.foc')).click();
    webdriver_test.sleep(5);
    //check loginName
    let loginName = await driver.findElement(webdriver.By.css('.loginName')).getText();
    assert.equal(loginName,'sstest2님 로그인');
    webdriver_test.sleep(5);
    
    //find video
    tizen_test.input_key(tvkey.DOWN);
    webdriver_test.sleep(3);
    tizen_test.input_key(tvkey.DOWN);
    webdriver_test.sleep(3);
    tizen_test.input_key(tvkey.OK);
    webdriver_test.sleep(3);
    tizen_test.input_key(tvkey.OK);
    webdriver_test.sleep(20);
 
    //play
    await tizen_test.test_avplayer(driver);
    
    //return from avplayer
    tizen_test.input_key(tvkey.RETURN);
    webdriver_test.sleep(3);
    tizen_test.input_key(tvkey.RETURN);
    webdriver_test.sleep(3);
    
    //logout
    await driver.findElement(webdriver.By.css('.setting')).click();
    await driver.findElement(webdriver.By.css('#subMenu25 > .ndiv')).click();
    webdriver_test.sleep(5);
    await driver.findElement(webdriver.By.css('.alertPopUp03 > .popupBtnArea > .pbtn01.foc')).click();
    webdriver_test.sleep(5);
 
    */

   
})().then(_ => console.log('SUCCESS'), err => console.error('ERROR: ' + err));