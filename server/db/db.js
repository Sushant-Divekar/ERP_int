const mongoose = require('mongoose');

const connect = async () =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/ERP' , {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }catch(err){
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }

    
}

module.exports = connect;