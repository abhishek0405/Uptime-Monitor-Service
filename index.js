const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const server  = http.createServer(function(req,res){
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
    
    
})

server.listen(3000,()=>{
    console.log("server listening on port 3000");
})
let handlers={}

handlers.sample = function(data,callback){
    //callback has status code and payload
    callback(406,{'name':'sample'})
}
//not found handler
handlers.notFound = function(data,callback){
    callback(404);
}
let router = {
    'sample':handlers.sample
}