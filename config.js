/*
	Constants and Configurations
*/

exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT || 5000;

exports.DB = {
	url : process.env.DB_URL,
};

exports.SF ={
	clientId : process.env.SF_CANVASAPP_CLIENT_ID,
	clientSecret : process.env.SF_CANVASAPP_CLIENT_SECRET,
}

