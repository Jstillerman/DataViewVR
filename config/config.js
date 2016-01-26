var path = require('path'),
        rootPath = path.normalize(__dirname + '/..'),
	    env = process.env.NODE_ENV || 'development';

var config = {
	  development: {
			           root: rootPath,
				       app: {
					             name: 'v-r-display'
							         },
				           port: 8000,
					       db: 'mongodb://admin:admin@ds049945.mongolab.com:49945/vr-display-db'
						         },

	    test: {
			      root: rootPath,
			          app: {
					        name: 'v-r-display'
							    },
				      port: 3000,
				          db: 'mongodb://localhost/v-r-display-test'
						    },

	      production: {
				      root: rootPath,
				          app: {
						        name: 'v-r-display'
								    },
					      port: 3000,
					          db: 'mongodb://localhost/v-r-display-production'
							    }
};

module.exports = config[env];
