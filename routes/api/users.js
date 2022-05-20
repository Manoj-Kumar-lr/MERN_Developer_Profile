const express = require('express');

const routes = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

// @route POST api/users
// @desc Register User
// @access Public

routes.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please include valid email address').isEmail(),
    check('password', 'Please enter a password minimum of 6 length or more').isLength({min:6})
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name,email,password} = req.body;

    try {
       let user = await User.findOne({email});
       if(user){
            return res.status(400).json({errors:[{msg:'User already registered!..'}]});
       }
      
       const avatar = gravatar.url(email,{
           s:'200',
           r:'pg',
           d:'mm'
       })

        user = new User({
           name,
           email,
           password,
           avatar
       });

       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password,salt);
       await user.save();

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