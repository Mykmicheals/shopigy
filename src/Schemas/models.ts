import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname:String,
    email: { type: String, unique: true }, 
    password: String,
    phoneNumber: String,
    isVerified: Boolean,
    userToken: String,
    lastname: String,
    
})


const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
  //  expireAt: { type: Date, default: Date.now, expireAfterSeconds: 30 } 
});



export const User = mongoose.model('User', userSchema)
export const Token = mongoose.model('Token', tokenSchema)