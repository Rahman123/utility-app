# utility-app
===========

## Different utilities in one app

### Set config.js variables (https://devcenter.heroku.com/articles/config-vars):
	$ heroku config:set GITHUB_USERNAME=joesmith
	Adding config vars and restarting myapp... done, v12
	GITHUB_USERNAME: joesmith

	$ heroku config
	GITHUB_USERNAME: joesmith
	OTHER_VAR:       production

	$ heroku config:get GITHUB_USERNAME
	joesmith

	$ heroku config:unset GITHUB_USERNAME
	Unsetting GITHUB_USERNAME and restarting myapp... done, v13

http://utility-app.herokuapp.com/

## Run a MongoDB instance if deployed locally (if no port is locked, you can use a remote MongoDB instance as well)

Mongo DB is on Atlas MongoDB mongodb.net
https://cloud.mongodb.com/v2/5f84c753268d972bc588a697#security/database/users
