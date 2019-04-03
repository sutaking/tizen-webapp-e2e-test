var logging  = require('selenium-webdriver/lib/logging');
var logger = logging.getLogger();
var assert = require('assert'); 
var child_process = require('child_process');
var config = require("../fixtures/deviceconfig.js");
var path = require("path");

		
function sdb(){
	this.call_command = function(cmd, timeout_sec=120){
		var timeout_sec = timeout_sec;
		var options = {
			timeout: timeout_sec
		};
		
		var s = child_process.execSync(cmd);
		console.log(s.toString());
		return s;
	};

	this.get_sdb_command = function(){
		var sdb_command;
		if(parseInt(config.tizen_version) == 3){
			sdb_command = "sdb_2.2.57";
		}else {
			sdb_command = "sdb_2.3";
		}
		//sdb_command_path = path.resolve("external/" + sdb_command + ".exe");
		sdb_command_path = path.resolve('./sdb/linux/sdb')
		console.log("sdb_command_path: " + sdb_command_path);
		return sdb_command_path;
	};

	this.connect = function(remote){
		var cmd = this.get_sdb_command()+" connect "+ remote;
		console.log("shell command: " + cmd);
		var cmdresult = this.call_command(cmd);
		console.log(cmdresult.toString());
		//return (!cmdresult.has_error);
		return true;
	};

	
	this.devices = function(){
		var cmd = this.get_sdb_command() +" devices";
		console.log("shell command: " + cmd);
		
		var cmdresult = this.call_command(cmd);
		//assert.ok(!cmdresult.has_error);

		var line_array = cmdresult.toString().split(/\r?\n/ig);
		var tizen_devices;
		
		line_array.forEach(function(line) {
			if(line.length != 0&&
				!line.startsWith("*") && 
			   !line.startsWith("List")){
			   console.log("device:"+line);
			   tizen_devices = line;
			}

		});
		
		return tizen_devices;	

	};

	this.shell = function(command, serial=""){	
		if(serial){
			serial = "-s " + serial;
		}

		if(!this.devices()){	
			var tvconfig=new config();
			if(tvconfig.is_huart != "on"){			
				assert(this.connect(tvconfig.ip));
			}
		}

		if(!this.devices()){
			console.log("No devices connected");
		}

		var cmd = this.get_sdb_command()+ " " +serial+" shell " +command;
		console.log("shell command: " + cmd);
		
		var cmdresult = this.call_command(cmd);
		return cmdresult;
	};

};
module.exports = sdb;
