const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect('mongodb+srv://niyatipatel0701:L7pOmBifCE1C3X6e@cluster0.hepr5.mongodb.net');
        console.log(`Database Connected`);
    }
    catch(err){
        console.log(`Error Connecting Database ${err}`);

    }
}
module.exports=connectDB
