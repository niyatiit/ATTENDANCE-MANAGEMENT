const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ["teacher", "student"],
        required : true
    }
}
);

// Create the User model
const User = mongoose.model("User", UserSchema);

// Export the model for use in controllers
module.exports = User;
