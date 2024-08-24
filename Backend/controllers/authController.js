const { hashPassword, comparePassword } = require('../helpers/authHelper')
const userModel =require('../models/userModel')
const jwt=require('jsonwebtoken');


const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,address}=req.body

        //validations
        if(!name){
            return res.send({error:'Name is Required'})
        }
        if(!email){
            return res.send({error:'Email is Required'})
        }
        if(!password){
            return res.send({error:'Password is Required'})
        }
        if(!phone){
            return res.send({error:'Phone is Required'})
        }
        if(!address){
            return res.send({error:'Address is Required'})
        }

        //check users
        const existingUser=await userModel.findOne({email})

        //exisiting users
        if(existingUser){
            return res.status(200).send({
                success:true,
                message:'Already Registered please login'
            })
        }

        //register user
        const hashedPassword=await hashPassword(password)

        //save
        const registeredUser=await new userModel({name,email,phone,address,password:hashedPassword}).save()

        res.status(201).send({
            success:true,
            message:'User registered Successfully',
            registeredUser

        })




    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registation',
            error

        })
    }

}

//POST LOGIN

const loginController=async(req,res)=>{

    try {
        const {email,password}=req.body

        if(!email||!password){
            return res.status(404).send({
                success:false,
                message:'Invalid Email OR Password'

            })
        }
        //check user
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Error in login',
                error

            })
        }

        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password'
            })
        }

        const token=await jwt.sign({_id:user._id},process.env.jwt_Secret,{
            expiresIn:"7d"
        })

        res.status(200).send({
            success:true,
            message:'login successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
            },
            token

        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
        success:false,
        message:'Error In Login',
        error
    })
    }
}

module.exports=registerController
module.exports=loginController