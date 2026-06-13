import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import User from './models/User.js'
import Query from './models/Query.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

const mongouri = 'mongodb+srv://hatake2kakashi2_db_user:uSKChsPB3m7kOt3b@agri.pugce1u.mongodb.net/?appName=agri'
mongoose.connect(mongouri).then(()=>{console.log("connected to db")}).catch((err)=>{console.log(err)})

// Register User
app.post('/api/auth/register',async(req,res)=>{
    try {
        const {fullname,email,password,confirmpassword,phone} = req.body
        if(!fullname || !email || !password || !confirmpassword || !phone){
            return res.status(400).json({message:"all field required"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"email already exists"})
        }
        if(password !== confirmpassword){
            return res.status(400).json({message:"passwords do not match"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phone
        })

        await newUser.save()
        res.status(201).json({message:"User created successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

// Login User
app.post('/api/auth/login',async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password)
        {
            return res.status(400).json({message: 'both feilds are mandatory'})
        }
        const existinguser = await User.findOne({email})
        if(!existinguser)
        {
            return res.status(400).json({message:'user does not exist'})
        }

        const compare = await bcrypt.compare(password,existinguser.password)

        if(!compare)
        {
            return res.status(400).json({message:'Incorrect Password'})
        }

        res.status(200).json({message: 'Login sucessfull'})
    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
})

// Save voice query history
app.post('/api/queries', async (req, res) => {
    try {
        const { email, queryText, aiResponse } = req.body
        if (!email || !queryText || !aiResponse) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const newQuery = new Query({ email, queryText, aiResponse })
        await newQuery.save()
        res.status(201).json({ message: "Query history saved successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

// Retrieve voice query history for a user
app.get('/api/queries', async (req, res) => {
    try {
        const { email } = req.query
        if (!email) {
            return res.status(400).json({ message: "Email parameter is required" })
        }
        const history = await Query.find({ email }).sort({ createdAt: -1 })
        res.status(200).json(history)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})