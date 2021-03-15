//library for storing and editing data


const fs = require('fs');
const path = require('path');

let lib = {};
lib.baseDir = path.join(__dirname,'../.data/')//__dirname tells current dir and now go back or ahead based on 2nd argument

lib.create = function(dir,file,data,callback){
    //wx for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //convert json data to string
            let string = JSON.stringify(data);
            //write data to a file
            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callback(false);
                        } else{
                            callback("error closing new file");
                        }
                    })
                } else{
                    console.log("error while writing to the file");
                }
            })
        }else{
            callback('Could not create new file,it may exist');
        }
    })
}