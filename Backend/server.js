const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const connectDB =require('./config/db');
const authRoutes=require('./routes/authRoute');
const cors=require('cors');

//configure env
dotenv.config()

//rest object
const app=express();

//database config
connectDB();

//middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);

//rest api
app.get('/',(req,res)=>{
    res.send(
       "<h1>Hello Ecommerce</h1>"
    )
})

//port 
const PORT=process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log(`Server Running On PORT ${PORT}`)
})