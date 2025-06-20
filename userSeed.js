import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async ()=>{
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        })
        await newUser.save() 
    } catch(error){
        console.log(error)
    }
}

userRegister();

// Why do we use a user seed file?

// To insert a default user (like admin) into the database for 
// initial setup, testing, or admin access without manual registration.
// we would like to register admin just once