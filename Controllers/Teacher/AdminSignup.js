
const express = require('express');
const bcrypt = require('bcrypt');
const AdminModel = require('../../Models/AdminModel');  //adim == teacher
const GeneratedOtp = require('../OtpGenerator');
const EmailSender = require('../EmailToUser');

const client = require('../../client');


const AdmSignup = async (req, res) => {
    try {
        // app.use(express.json());
        const { email, name, password, role, FuckltyOf
        } = req.body;

        //checking proper request coming or not
       console.log("data",req.body)

        if (!email || !password || !name || !role || !FuckltyOf
        ) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            })
        }

        const isUserPresent = await AdminModel.findOne({AdminEmail : email})
        if(isUserPresent){
            return res.status(200).json({
                message : "User already exists please login",
                success : false,
            })
        }


        
        //send opt function to user

        const otp = GeneratedOtp();
        // console.log("generated otp", otp);
        const saveOtp_to_redis =await client.set(`otp:${email}`, otp); //ise save krna hai in redis db

        console.log("otp saved to redis", saveOtp_to_redis);

        //email send to user 
        


        //wait for user side otp
        // encrypt the password
        //salt generation
        const saltRounds = 10;

        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashpass = await bcrypt.hash(password, salt);

            console.log("Encrypted Password:", hashpass);

            //database model document
            const dataToSave = {
                AdminName: name,
                AdminEmail: email,
                password: hashpass,
                role: role,
                Department: FuckltyOf,
            };
            await client.set(`data:${email}`, JSON.stringify(dataToSave))
            res.status(201).json({ message: "User Otp Send to mail successfully!", user: dataToSave });

        } catch (error) {
            res.status(500).json({ message: "Error encrypting password", success: false, error });
        }

        const responseEmail = await EmailSender(email,otp);
        if(responseEmail){
            return res.status(200).json({
                message : `OTP send Succesfully to ${email}`,
                success : true
            })
        }
        else if(!responseEmail) {
            return res.status(500).json({
                message : "error pleas try again",
                success : false,
            })
        }



        // const objectToDb = {
        //     username : username,
        //     email : email,
        //     password : hashpass,
        //     role : role
        // }
        // console.log("hiiii ", hashpass)

        // Note :- you can  not write the code for saving userdata to database because if encrypt fail which lead to bad writing in database


        //Outside of the try-catch block, hash is undefined because bcrypt.hash() is asynchronous. If you don't use await, the execution moves forward before the hashing completes.


       
    } catch (error) {
        res.status(500).json({ message: "Error signing up user", error: error.message });
    }
};

module.exports = AdmSignup;