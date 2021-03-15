
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
//instantiate http server
const httpServer  = http.createServer(function(req,res){
   unifiedServer(req,res);
})

//instantiate https server

let httpsServerOptions={
    'key': fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
}
const httpsServer  = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
 })


//start http server
httpServer.listen(config.httpPort,()=>{
    console.log(config.envName+" environment  server listening on port "+config.httpPort);
})


//start https server
httpsServer.listen(config.httpsPort,()=>{
    console.log(config.envName+" environment  server listening on port "+config.httpsPort);
})


//both http and https server logic

let unifiedServer = function(req,res){
    var parsedURL = url.parse(req.url,true);//true to allow to use query string
    var method = req.method.toLowerCase();
    // the .replace used to get rid of leading or trailing slashes
    var path = parsedURL.pathname.replace(/^\/+|\/+$/g,'');
    
    var queryStringObject = parsedURL.query;
    let headers  = req.headers;
    //you will get error if you use + instead of , for querystringobject

    //getting payloads ie parsing the stream to a string

    let decoder = new StringDecoder('utf-8');
    var buffer="";
    //whenever receiving data
    req.on('data',data=>{
        buffer+= decoder.write(data);
        
    })
    //when all data received(this always called even if no data)
    req.on('end',()=>{
        //redirect according to path given by user
        buffer+= decoder.end();
        console.log("User has hit "+path +" by "+method+" method with query paramets as ",queryStringObject);
        let chosenHandler = typeof(handlers[path])!=='undefined'?router[path]:handlers.notFound;//stores the appropriate function

        let data={
            'path':path,
            'queryStringObject':queryStringObject,
            'method':method,
            'headers':headers,
            'payload':buffer

        };
        //calling the function
        chosenHandler(data,(statusCode,payload)=>{
            //defining the call back now
            statusCode = typeof(statusCode)=='number'?statusCode:200;

            payload = typeof(payload)=='object'?payload:{};
            let payloadString = JSON.stringify(payload);
            //to get a json object
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning the response: ',statusCode,payloadString);
        })

    })
}


let handlers={}

handlers.ping = (data,callback)=>{
    callback(200);
}
//not found handler
handlers.notFound = function(data,callback){
    callback(404);
}
let router = {
    'ping':handlers.ping
}
