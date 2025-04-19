import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'

//initalize express
const app = express()

//connect to db
await connectDB()

//middlewares
app.use(cors())


//Routes
app.get('/',(req,res)=> res.send("API working"))
app.post('/clerk', express.json(), clerkWebhooks)

//port
const PORT = process.env.PORT || 5000

app.listen(PORT, (req,res)=>{
    console.log(`Server is running on ${PORT}`);
    
})