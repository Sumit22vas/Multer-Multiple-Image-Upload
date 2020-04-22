const express = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

//Init App
const app = express();

// set storage engine
const storage = multer.diskStorage({
    destination : './public/images',
    filename : function(req,file,cb) {
        cb(null,file.fieldname+'-'+ uuid.v4() + path.extname(file.originalname));
    }
});

// Initailize upload
const upload = multer({
    storage : storage,
    limits : {fileSize : 2 * 1024* 1024}, // filesize limit set
    fileFilter : function(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('only images are allowed to upload'));
        }else{
            cb(null,true);
        }
    }
}).array('image',10); //Specify the number of images you want to upload


//app use
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('./public'));




//Home Route
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

// /upload Route
app.post('/upload',(req,res)=>{
    upload(req,res, (err)=>{  //calling upload to upload images
        if(err) {
            res.status(200).json({
                type : 'danger',
                alert : 'Error !!!',
                msg : err.message
            });
            
        }else {
            let nameArray = [];
            for(i= 0; i < req.files.length ; i++) {
                    nameArray.push(req.files[i].filename);
            }
    
            res.status(200).json({
                type : 'success',
                alert : 'Success !!!',
                msg : 'File Uploaded SuccessFully',
                image : nameArray
            });
            
        }
    });
});


const port = 3000 || process.env.PORT;
app.listen(port,()=>{console.log(`server is running at ${port}`);});