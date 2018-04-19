var config = require('../../config.json');

function DeviceConfig(){
   
	return {
		board : config.target.board,
		is_huart : config.target.is_huart,
        huart : config.target.huart,
        tizen_version : config.target.tizen,

        tv_panel : config.factory.tv_panel,
        sw_model : config.factory.sw_model,
        hvflip : config.factory.hvflip,

        ip : config.network.ip,
        subnet : config.network.subnet,
        gateway : config.network.gateway,
        dns : config.network.dns,
        tizen_proxy : config.network.proxy,
	};
		
};

module.exports = DeviceConfig;