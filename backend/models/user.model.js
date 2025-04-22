import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique : true, 
    },
    email: {
        type : String,
        required : true,
        unique : true, 
    },
    password: {
        type : String,
        required : true,
    },
    profilePicture: {
        type: String,
        default: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/profile-design-template-4c23db68ba79c4186fbd258aa06f48b3_screen.jpg",
    },
    nic: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "manager", "collector", "user"],
        default: "user",
      },
      
    isCompleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;