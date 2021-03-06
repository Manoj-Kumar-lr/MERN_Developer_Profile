const express = require('express');

const routes = express.Router();
const Auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

// @route GET api/auth
// @desc Test Route
// @access Public

routes.get('/', Auth, async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error!..');
    }
});

// @route POST api/auth
// @desc Authenticate User
// @access Public

routes.post('/', [
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Password is required!..').exists()
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;

    try {
       let user = await User.findOne({email});
       if(!user){
            return res.status(400).json({errors:[{msg:'Invalid Credentials!..'}]});
       }

       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
           return res.status(400).json({errors:[{msg:'Invalid Credentials!..'}]});
       }

       const payload = {
         user: {
             id: user.id
         }
       }

       jwt.sign(
           payload,
           config.get('jwtSecretKey'),
           {expiresIn:360000},
           (err, token) => {
               if(err) throw err
               res.json({token});
           }
        )

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error...');
    }
});

module.exports = routes;