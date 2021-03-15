//create and export config vars

//container for environments

let environments = {};

environments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging'
};

environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production'

}

//determine which to export with command line arg

let currentEnvironment = typeof(process.env.NODE_ENV) =='string'?process.env.NODE_ENV.toLowerCase():'';

//check if environment valid
let exportEnvironment = typeof(environments[currentEnvironment])=='object'? environments[currentEnvironment]:environments.staging;//by default staging

module.exports = exportEnvironment;
