const mongoose = require("mongoose");

const DB = "mongodb+srv://admin:admin@crud.ejuxw.mongodb.net/Flows?retryWrites=true&w=majority"


mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("connection start")).catch((error)=> console.log(error.message));