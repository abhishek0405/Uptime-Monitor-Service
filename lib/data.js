//library for storing and editing data


const fs = require('fs');
const path = require('path');

let lib = {};
lib.baseDir = path.join(__dirname,'/../.data/')//__dirname tells current dir and now go back or ahead based on 2nd argument
console.log(lib.baseDir);
lib.create = function(dir,file,data,callback){
    //wx for writing
    console.log(lib.baseDir+'hello1'+'\\'+'hello.json');
    //let path = lib.baseDir+dir+''+ file + '.json';
    //create folder if doesn't exist
    if (!fs.existsSync(lib.baseDir+dir)){
        fs.mkdirSync(lib.baseDir+dir);
    }
    fs.open(lib.baseDir+dir+'\\'+file+'.json','wx',function(err,fileDescriptor){
        console.log(fileDescriptor);
        if(!err && fileDescriptor){
            //convert json data to string
            let stringData = JSON.stringify(data);
            //write data to a file
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);//as we will do if(err) while using originally
                        } else{
                            callback("error closing new file");``
                        }
                    })
                } else{
                    callback("error while writing to the file");
                }
            })
        }else{
            callback('Could not create new file,it may exist');
        }
    })
}

//read functionality

lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'\\'+file+'.json','utf-8',function(err,data){
    
        callback(err,data);
        
        
    })
}

//update functionality(to rewrite)

lib.update = function(dir,file,data,callback){
    let filePath = lib.baseDir+dir+'\\'+file+'.json';
    //r+ gives er if does not exist file
    fs.open(filePath,'r+',function(err,fileDesc){
        if(!err && fileDesc){
            let stringData = JSON.stringify(data);
            fs.ftruncate(fileDesc,function(err){
                if(!err){
                    fs.writeFile(fileDesc,stringData,function(err){
                        if(!err){
                            fs.close(fileDesc,function(err){
                                callback(err);
                            })
                        }
                    })
                }
            })

        }else{
            callback("file does not exist");
        }
    })
}

//delete functionality
lib.delete = function(dir,file,callback){
    let filePath = lib.baseDir+dir+'\\'+file+'.json';
    fs.unlink(filePath,function(err){
        if(err){
            
            callback('Error while deleting')
        }
        else{
            callback(false);
        }
    })
}



module.exports = lib;