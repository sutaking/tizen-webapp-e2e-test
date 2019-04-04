var logging  = require('selenium-webdriver/lib/logging');
var logger = logging.getLogger();
var assert = require('assert'); 
var sdb =  require('./sdb.js');


function tizen(){	
	var tvsdb=new sdb();

	this.get_app_package_name = function(appid){
		var strgrep = "wascmd -l -k " + appid + "| grep app_package_name";		
		var result = tvsdb.shell('"'+strgrep+'"');
		console.log("get_app_package_name:"+result);

		assert(result.toString().length != 0);
		
		var replaceresult = result.toString().replace(new RegExp("-", 'g'), "");
		replaceresult =  replaceresult.trim();
		var package_name_index = replaceresult.search("app_package_name");
		assert(package_name_index!= -1);

		var package_name;
		var index = replaceresult.search("=");		
		if (index!= -1){
    		package_name = replaceresult.substring(index+1,replaceresult.length);
			console.log("package_name:"+package_name);
  		} 
		
		return package_name;
	};

	this.app_status = function(appid){
		var cmdresult = tvsdb.shell("app_launcher -S");
		console.log("apps_status:"+cmdresult);

		assert(cmdresult.toString().length != 0);

		var line_array = cmdresult.toString().split(/\r?\n/ig);	
		var pid_info;
		
		line_array.forEach(function(line) {
			var trimline = line.trim();

			if(trimline.length != 0&&
				trimline.startsWith(appid)){
			   pid_info = trimline;
			   console.log("pid_info:"+pid_info);
			}
		});

		var pid;
		if(pid_info && pid_info.length != 0){
			var pid_start_index = pid_info.toString().search("\\(");
			if(pid_start_index!=-1){
				pid = pid_info.toString().substring(pid_start_index+1,pid_info.toString().length-1);
				console.log("pid:"+pid);
			}
		}
		
		return pid;
	};

	this.install_app = function(app_id){
		var strgrep = "wascmd -l|grep  " + app_id;
		var result = tvsdb.shell('"'+strgrep+'"');
		console.log("install_app:"+result);
		
		if(result.length != 0){
			console.log("Already installed app " + app_id)
		}else{
			console.log("install app " + app_id);
			tvsdb.shell("wascmd -i " + app_id);
		}
	};

	this.launch_app = function(appid, debug=false, webapp=true){
		if(debug){
			debug = "-d";
		}else{
			debug = "";
		}
		
		if(webapp){
			webapp = "-w";
		}else{
			webapp = "";
		}

		var result = tvsdb.shell("app_launcher " + debug + " " +webapp +" -s "+ appid);
		console.log("launch_app:"+result);

		assert(result && result.toString().length != 0);
		result = result.toString().trim();
		
		var pid;
		var pid_index = result.toString().search("pid =");
		var with_index = result.toString().search("with");		
		if (pid_index!= -1 && with_index!=-1){
    		pid = result.toString().substring(pid_index+6,with_index-1);
			console.log("****************pid:"+pid);
  		} 

		var debug_port;
		var port_index = result.toString().search("port:");
		if (port_index!= -1){
    		debug_port = result.toString().substring(port_index+6);
			console.log("*************debug_port:"+debug_port);
  		} 

		return debug_port;

	};


	this.terminate_app = function(appid){
		var result = tvsdb.shell("app_launcher -t " + appid);
		assert(result.toString().length != 0);
	};
	

	this.check_appversion = function(app_id, app_version){
		var strgrep = "wascmd -l -k " + app_id + "| grep app_version";		
		var result = tvsdb.shell('"'+strgrep+'"');
		console.log("check_appversion:"+result);

		assert(result.toString().length != 0);
		
		var replaceresult = result.toString().replace(new RegExp("-", 'g'), "");
		replaceresult =  replaceresult.trim();
		var app_version_index = replaceresult.search("app_version");
		assert(app_version_index!= -1);

		var rel_app_version;
		var version_index = replaceresult.search("=");		
		if (version_index!= -1){
    		rel_app_version = replaceresult.substring(version_index+1,replaceresult.length);
			console.log("rel_app_version:"+rel_app_version);
  		} 

		if(rel_app_version.toString() != app_version.toString()){
			console.log("App version is different!! App version is :"+rel_app_version)
		}else{
			console.log("App version is : " + rel_app_version);
		}
		
	};

	this.kill = function(package_name){
		var result = tvsdb.shell(" 0 kill " + package_name);
		assert(result.toString().length != 0);
	};

	this.input_key = function(key){
		var result = tvsdb.shell("vk_send " + key);
	};


	this.sleep = function(sleep_time) {
		console.log("sleep:" + sleep_time);
		var now = new Date();
		var exitTime = now.getTime() + sleep_time*1000;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime)
			return;
		}
	};


	this.test_capiplayer_for_audio= async function(driver){
    
	    //PLAY
	    await driver.executeScript("document.querySelector('audio').play()");
	    this.sleep(1);
	    for(var i=0; i<10;i++){
	        this.sleep(1);
			var playStatus = await driver.executeScript("return document.querySelector('audio').paused");
			console.log("[CAPIPLAYER] pause status: " + playStatus);
	        assert.equal(playStatus , false);
	    }
	    this.sleep(5);

	    //SEEK
	    await driver.executeScript("document.querySelector('audio').currentTime = 5");
		var seekto_time = await driver.executeScript("return document.querySelector('audio').currentTime");
	    var currentTime = parseInt(seekto_time);
	    console.log("[CAPIPLAYER_AUDIO] currentTime: " + currentTime);
	    assert.equal(currentTime , 5);
	    this.sleep(5);

	    //PAUSE
	    await driver.executeScript("document.querySelector('audio').pause()");
		var playStatus = await driver.executeScript("return document.querySelector('audio').paused");
		console.log("[CAPIPLAYER] pause status: " + playStatus);
	    assert.equal(playStatus , true);
	    this.sleep(5);

	    //RESUME PLAY
	    await driver.executeScript("document.querySelector('audio').play()");
	    playStatus = await driver.executeScript("return document.querySelector('audio').paused");
		console.log("[CAPIPLAYER] playStatus: " + playStatus);
	    assert.equal(playStatus , false);
	    this.sleep(5);

	    //SPEED 2
	    await driver.executeScript("document.querySelector('audio').playbackRate = 2");
		var rate = await driver.executeScript("return document.querySelector('audio').playbackRate");
		var playbackRate = parseInt(rate);
	    console.log("[CAPIPLAYER_AUDIO] playbackRate: " + playbackRate);
	    assert.equal(playbackRate , 2);
	    this.sleep(10);

	    //SPEED -2
	    await driver.executeScript("document.querySelector('audio').playbackRate = -2");
	    rate = await driver.executeScript("return document.querySelector('audio').playbackRate");
		playbackRate = parseInt(rate);
	    console.log("[CAPIPLAYER_AUDIO] playbackRate: " + playbackRate);
	    assert.equal(playbackRate , -2);
	    this.sleep(5);
	};

	
	this.test_capiplayer= async function(driver){

	    //PLAY
	    await driver.executeScript("document.querySelector('video').play()");
	    this.sleep(1);
	    for(var i=0; i<10;i++){
	        this.sleep(1);
			var playStatus = await driver.executeScript("return document.querySelector('video').paused");
			console.log("[CAPIPLAYER] pause status: " + playStatus);
	        assert.equal(playStatus , false);
	    }
	    this.sleep(5);

	    //SEEK
	    await driver.executeScript("document.querySelector('video').currentTime = 5");
		var seekto_time = await driver.executeScript("return document.querySelector('video').currentTime");
	    var currentTime = parseInt(seekto_time);
	    console.log("[CAPIPLAYER] currentTime: " + currentTime);
	    assert.equal(currentTime , 5);
	    this.sleep(5);

	    //PAUSE
	    await driver.executeScript("document.querySelector('video').pause()");
		var playStatus = await driver.executeScript("return document.querySelector('video').paused");
		console.log("[CAPIPLAYER] pause status: " + playStatus);
	    assert.equal(playStatus , true);
	    this.sleep(5);

	    //RESUME PLAY
	    await driver.executeScript("document.querySelector('video').play()");
	    playStatus = await driver.executeScript("return document.querySelector('video').paused");
		console.log("[CAPIPLAYER] playStatus: " + playStatus);
	    assert.equal(playStatus , false);
	    this.sleep(5);

	    //SPEED 2
	    await driver.executeScript("document.querySelector('video').playbackRate = 2");
	    var rate = await driver.executeScript("return document.querySelector('video').playbackRate");
		var playbackRate = parseInt(rate);
	    console.log("[CAPIPLAYER] playbackRate: " + playbackRate);
	    assert.equal(playbackRate , 2);
	    this.sleep(10);

	    //SPEED -2
	    await driver.executeScript("document.querySelector('video').playbackRate = -2");
	    rate = await driver.executeScript("return document.querySelector('video').playbackRate");
		playbackRate = parseInt(rate);
	    console.log("[CAPIPLAYER] playbackRate: " + playbackRate);
	    assert.equal(playbackRate , -2);
	    this.sleep(5);
	};


	this.test_avplayer = async function (driver){

		//play
		await driver.executeScript("webapis.avplay.play()");
		this.sleep(2);
		
		for(var i=0; i<10;i++){
			this.sleep(1);
			var state = await driver.executeScript("return webapis.avplay.getState()");
			console.log("state:"+state);
			assert.strictEqual(state, "PLAYING");
		}
		this.sleep(10);

		//seek to
		await driver.executeScript("webapis.avplay.seekTo(50000)");
		var seekto_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
		var endTime = parseInt(seekto_time);
		console.log("[AVPLAYER] player seek to time: " + endTime);  
		assert.ok(49000 < endTime && endTime < 52000);
		this.sleep(20);

		//jumpForward
		var begin_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
		var beginTime = parseInt(begin_time);
		
		await driver.executeScript("webapis.avplay.jumpForward(20000)");
		
		var end_time =await driver.executeScript("return webapis.avplay.getCurrentTime()");
		var endTime = parseInt(end_time);
		console.log("[AVPLAYER] player beginTime: " + beginTime);
		console.log("[AVPLAYER] player endTime: " + endTime);
		assert(beginTime < endTime);
		
		var forwardtime = parseInt(endTime - beginTime);
		console.log("[AVPLAYER] player forwardtime: " + forwardtime);
		assert(19000 < forwardtime && forwardtime< 22000);
		this.sleep(20);

		//jumpBackward
		begin_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
		beginTime = parseInt(begin_time);
		
		await driver.executeScript("webapis.avplay.jumpBackward(5000)");
		
		end_time =await driver.executeScript("return webapis.avplay.getCurrentTime()");
		endTime = parseInt(end_time);
		console.log("[AVPLAYER] player beginTime: " + beginTime);
		console.log("[AVPLAYER] player endTime: " + endTime);
		assert(beginTime > endTime);	
		
		var backwardtime = parseInt(beginTime - endTime);
		console.log("[AVPLAYER] player backwardtime: " + backwardtime);
		assert(2000 < backwardtime && backwardtime< 6000);
		this.sleep(10);

		//setSpeed 2
		await driver.executeScript("webapis.avplay.setSpeed(2)");
		this.sleep(7);

		//setSpeed 1
		await driver.executeScript("webapis.avplay.setSpeed(1)");
		this.sleep(7);

		//pause
		await driver.executeScript("webapis.avplay.pause()");
		var state =await driver.executeScript("return webapis.avplay.getState()");
		console.log("[AVPLAYER] player state: " + state);
		assert.strictEqual(state, "PAUSED");
		this.sleep(7);

		//play
		await driver.executeScript("webapis.avplay.play()");
		for(var i=0; i<10;i++){
			this.sleep(1);
			var state =await driver.executeScript("return webapis.avplay.getState()");
			console.log("[AVPLAYER] player state: " + state);
			assert.strictEqual(state, "PLAYING");
		}
		this.sleep(10);
	
	};


	this.test_avplayer_speed = async function(driver){

	    //play
	    await driver.executeScript("webapis.avplay.seekTo(0)");
	    for(var i=0; i<10;i++){
	        this.sleep(1);
	        var state = await driver.executeScript("return webapis.avplay.getState()");
	        console.log("[AVPLAYER] player state: " + state);
	        assert.strictEqual(state, "PLAYING");
	    }
	    this.sleep(10);

	    //speed 1
	    var begin_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
	    var beginTime = parseInt(begin_time);
		
	    await driver.executeScript("webapis.avplay.setSpeed(1)");
		this.sleep(10);
		
		var end_time =await driver.executeScript('return webapis.avplay.getCurrentTime()');
	    var endTime = parseInt(end_time);
	    console.log("[AVPLAYER] player beginTime: " + beginTime);
	    console.log("[AVPLAYER] player endTime: " + endTime);
	    var speed = parseInt((endTime - beginTime) / 10000);
	    console.log("[AVPLAYER] player speed: " + speed);
	    //assert.equal(speed,1);
		
		
	    //speed 2
	    var begin_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
	    var beginTime = parseInt(begin_time);
		
	    await driver.executeScript("webapis.avplay.setSpeed(2)");
		this.sleep(10);
		
	    var end_time =await driver.executeScript('return webapis.avplay.getCurrentTime()');
	    var endTime = parseInt(end_time);
	    console.log("[AVPLAYER] player beginTime: " + beginTime);
	    console.log("[AVPLAYER] player endTime: " + endTime);
	    speed = parseInt((endTime - beginTime) / 10000);
	    console.log("[AVPLAYER] player speed: " + speed);
	    //assert.equal(speed,2);


	    //speed 4
	    var begin_time = await driver.executeScript("return webapis.avplay.getCurrentTime()");
	    var beginTime = parseInt(begin_time);
		
	    await driver.executeScript("webapis.avplay.setSpeed(4)");
		this.sleep(10);
		
	    var end_time =await driver.executeScript('return webapis.avplay.getCurrentTime()');
	    var endTime = parseInt(end_time);
	    console.log("[AVPLAYER] player beginTime: " + beginTime);
	    console.log("[AVPLAYER] player endTime: " + endTime);
	    speed = parseInt((endTime - beginTime) / 10000);
	    console.log("[AVPLAYER] player speed: " + speed);
	    //assert.equal(speed,4);
		this.sleep(10);
	};

	this.test_avplayer_for_radio =async function(driver){
		//play
	    await driver.executeScript("webapis.avplay.play()");
	    for(var i=0; i<10;i++){
	        this.sleep(1);
	        var state = await driver.executeScript("return webapis.avplay.getState()");
	        console.log("[AVPLAYER] player state: " + state);
	        assert.strictEqual(state, "PLAYING");
	    }
	    this.sleep(5);

        //pause
	    await driver.executeScript("webapis.avplay.pause()");
	    var state = await driver.executeScript("return webapis.avplay.getState()");
	    console.log("[AVPLAYER] player state: " + state);
	     assert.strictEqual(state,"PAUSED");
	    this.sleep(7);

        //play
	    await driver.executeScript("webapis.avplay.play()");
	    state = await driver.executeScript("return webapis.avplay.getState()");
	    console.log("[AVPLAYER] player state: " + state);
	    assert.strictEqual(state, "PLAYING");
	    this.sleep(7);
	};
	
};

module.exports = tizen;

