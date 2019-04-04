var logging = require('selenium-webdriver/lib/logging');
var logger = logging.getLogger();
var assert = require('assert');
var http = require('http');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var webbrowser = webdriver.chrome;
var config = require("./deviceconfig.js");
var tizen = require('../tizen/tizen.js');
var path = require("path");

function WebDrivers() {
	var port;
	var tizen_TV = new tizen();
	var config_TV = new config();
	this.select_chromedriver = function () {
		var chromedriver_path = "";
		if (config_TV.tizen_version == 3) {
			chromedriver_path = path.resolve("external/chromedriver_2.21.exe");
		} else if (config_TV.tizen_version == 4) {
			chromedriver_path = path.resolve("external/chromedriver_2.29.exe");
		} else {
			console.log("NOT SUPPORTED");
		}
		console.log("chromedriver_path: " + chromedriver_path.toString());
		return chromedriver_path;
	};

	this.create_appdriver = function (app_id, tizen_app_id) {
		tizen_TV.install_app(app_id);
		var app_stat = tizen_TV.app_status(tizen_app_id);
		console.log("app_stat:" + app_stat);
		
		if (app_stat) {
			if (config_TV.tizen_version == 3) {
				var package_name = tizen_TV.get_app_package_name(app_id);
				tizen_TV.kill(package_name);
			} else
				tizen_TV.terminate_app(tizen_app_id);
		}
		var launch_info = tizen_TV.launch_app(tizen_app_id);
		console.log("launch_info: " + launch_info);
		assert(launch_info && launch_info.toString().length != 0);
		this.port = launch_info;
		
		var chrome_options = new chrome.Options();
		if (config_TV.is_huart == "on") {
			chrome_options.options_["debuggerAddress"] = config_TV.huart + ":" + launch_info;
		} else {
			chrome_options.options_["debuggerAddress"] = config_TV.ip + ":" + launch_info;
		}

		chrome_options.addArguments("--proxy-server=" + config_TV.tizen_proxy);

		//var serviceBuilder = new chrome.ServiceBuilder(path.resolve('external/chromedriver'));
		var service = new chrome.ServiceBuilder(path.resolve('external/chromedriver')).build();

		var driver = chrome.Driver.createSession(chrome_options, service);
		return driver;
	};

	this.appdriver_context = function (app_id, tizen_app_id, debug = false) {
		var appdriver;
		var app;
		console.log('app_id: ' + app_id + ', tizen_app_id: ' + tizen_app_id);
		try {
			appdriver = this.create_appdriver(app_id, tizen_app_id);
			return appdriver;
		} catch (err) {
			if (debug) {
				appdriver.quit();
				var http = require('http');
				var url = "http://" + config_TV.ip + ":" + this.port;
				http.get(url, function (res) {
					var size = 0;
					var chunks = [];
					res.on('data', function (chunk) {
						size += chunk.length;
						console.log('size: ' + size);
						chunks.push(chunk);
					});
					res.on('end', function () {
						app = Buffer.concat(chunks, size);
						console.log("app " + '\n' + app.toString());
					});
				}).on('error', function (e) {
					console.log("Got error: " + e.message);
				});

				var open_url = "http://" + config_TV.ip + ":" + this.port;
				console.log('open_url: ' + open_url);
				webbrowser.open(open_url);
			} else {
				appdriver.close();
			}
		}
	};

	this.create_chromedriver = function () {
		console.log(`--------------
		create_chromedriver
		-----------------`);
		var chrome_options = new chrome.Options();
		chrome_options.addArguments("--proxy-server=" + config_TV.tizen_proxy);
		chrome_options.addArguments("--no-sandbox");
		var serviceBuilder = new chrome.ServiceBuilder("external/chromedriver_2.34.exe");
		var service = serviceBuilder.build();
		var driver = chrome.Driver.createSession(chrome_options, service);

		console.log("create_chromedriver success");
		return driver;
	};

	this.activator_context = function (debug = false) {
		var activator;
		console.log('activator_context');
		try {
			activator = this.create_chromedriver();
			return activator;
		}
		catch (err) {
			if (debug) {
				activator.quit();
			} else {
				activator.close();
			}
		}
	};

	this.sleep = function (sleep_time) {
		return tizen_TV.sleep(sleep_time);
	};

};
module.exports = WebDrivers;