//Connecting to database
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
mongoose.connect(process.env.database,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true ,
    useCreateIndex:true ,
    useFindAndModify:false
 });
const db = mongoose.connection;

//Debugging
db.on('error',function(error){
    console.log('database connection error');
});
db.once('open',function(){
    console.log('Database connected');
});

module.exports = mongoose;