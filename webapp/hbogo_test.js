'use strict';
const {Builder, By, Key, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome');
var webdrivers = require('../testlibs/fixtures/webdrivers.js');
var tizen = require('../testlibs/tizen/tizen.js');
var tizen_test = new tizen();
var tv_key =  require('../tv_keys.js');
var webdriver = require('selenium-webdriver');
var assert = require("assert");
var webdriver_test=new webdrivers();
var tvkey = new tv_key();
var accounts = require('../accounts.json');
var app_id = "111199000417";
var tizen_app_id = "sE95AS5GGv.HboGoTizen";

(async function() {
   //install and launch app
   var driver = webdriver_test.appdriver_context(app_id, tizen_app_id);
   webdriver_test.sleep(15);

   let welcome = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(4) > div:nth-child(2) > div > div > div:nth-child(2) > div > span > span')).getText();
   console.log('welcome =',welcome);
   assert('Welcome',welcome);
   webdriver_test.sleep(2);

   //get activation_code
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(3);
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(3);
   let activation_code = await driver.findElement(webdriver.By.css('body > div > div:nth-child(4) > div > div > div:nth-child(3)')).getText();
   console.log('activation_code = ',activation_code);
   webdriver_test.sleep(3);
   
   //activate hbogo in PC chrome
   var activator = webdriver_test.activator_context();
   await activator.get("http://hbogo.com/activate");
   webdriver_test.sleep(30); 
   await activator.findElement(webdriver.By.css("#select-device > div.section-content > div > div > div.ns-dropdown > div > a.arrow")).click();
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#select-device > div.section-content > div > div > div.ns-dropdown > div > ul > li.ng-scope.ng-binding.qa-device-selector-6")).click();
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#select-device > div.section-content > div > div > div:nth-child(2) > a")).click();
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#select-country > div.section-content > div.ng-scope > div > div.more-affiliates > div > div > a.arrow")).click();
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#select-country > div.section-content > div.ng-scope > div > div.more-affiliates > div > div > ul > li.ng-scope.ng-binding.qa-affiliate-selector-305")).click();
   webdriver_test.sleep(5);
   var iframe = await activator.findElement(webdriver.By.css("body > div.modal-overlay.ng-scope > div > hbo-modal > div.modal-login > iframe"));
   await activator.switchTo().frame(iframe);
   await activator.findElement(webdriver.By.css("#j_username")).sendKeys(accounts.hbogo.username);
   await activator.findElement(webdriver.By.css("#j_password")).sendKeys(accounts.hbogo.password);
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#loginForm > div:nth-child(6) > button")).click();
   webdriver_test.sleep(5);
   await activator.switchTo().defaultContent();
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#activation-pin > div:nth-child(1) > div:nth-child(1) > input")).sendKeys(activation_code);
   webdriver_test.sleep(5);
   await activator.findElement(webdriver.By.css("#activation-pin > div:nth-child(2) > div > a")).click();
   webdriver_test.sleep(5);

   //check the Watchlist 
   webdriver_test.sleep(2);
   let watchlist = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(4) > div:nth-child(2) > div > div > div:nth-child(2) > div > span > span')).getText();
   console.log('watchlist =',watchlist);
   assert('Watchlist',watchlist);
   webdriver_test.sleep(2);

   //search the video
   tizen_test.input_key(tvkey.UP);
   webdriver_test.sleep(3);    
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(3); 
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(3); 
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(20);   
   
   //play
   await tizen.test_avplayer(driver);
   
   //go to setting
   tizen_test.input_key(tvkey.RETURN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.RETURN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.RETURN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   
   webdriver_test.sleep(2);
   let setting = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(4) > div > div > div:nth-child(2) > div > div > span > span')).getText();
   console.log('setting =',setting);
   assert('SETTINGS',setting);
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(2);
   
   //Deactivate HBO GO
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   tizen_test.input_key(tvkey.DOWN);
   webdriver_test.sleep(2);
   let deactivatehbogo = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(4) > div > div > div:nth-child(6) > div:nth-child(2) > div > span > span')).getText();
   console.log('deactivatehbogo =',deactivatehbogo);
   assert('Deactivate HBO GO',deactivatehbogo);
   webdriver_test.sleep(2);
   
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(2);
   let deactivatenow = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(2) > div > div > div > div:nth-child(2) > div:nth-child(2) > div > span > span')).getText();
   console.log('deactivatenow =',deactivatenow);
   assert('Deactivate Now',deactivatenow);

   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(2);
   let textok = await driver.findElement(webdriver.By.css('#Viewport > div > div:nth-child(7) > div > div:nth-child(4) > div > div > div:nth-child(2) > div > span > span')).getText();
   console.log('textok =',textok);
   assert('OK',textok);
   
   tizen_test.input_key(tvkey.OK);
   webdriver_test.sleep(5);

   //exit
   tizen_test.input_key(tvkey.EXIT);

})().then(_ => console.log('SUCCESS'), err => console.error('ERROR: ' + err));
