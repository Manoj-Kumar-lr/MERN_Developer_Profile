const express = require('express');

const routes = express.Router();
const Auth = require('../../middleware/auth');
const {check,validationResult} = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const { Router, request } = require('express');

// @route POST api/posts
// @desc Create a Post
// @access Private

routes.post('/', [Auth,[
    check('text','Text field is Required!..').not().isEmpty()
]], async(req,res)=>{
   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors:errors.array()});
    }

   
    try {

        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });

        const post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..');
    }

});

// @route GET api/posts
// @desc Get all Posts
// @access Private

routes.get('/', Auth, async (req,res)=>{
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..')
    }
})

// @route GET api/posts/:id
// @desc Get Posts by ID
// @access Private

routes.get('/:id', Auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }
        res.json(post);
    } catch (err) {
        console.log(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        return res.status(500).send('Server Error!..')
    }
})

// @route DELETE api/posts/:id
// @desc Delete a Post
// @access Private

routes.delete('/:id', Auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'Post not found'});
        }

        //Check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized!.."});
        }

        await post.remove();

        res.json({msg:'Post is removed'});
    } catch (err) {
        console.log(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'});
        }
        return res.status(500).send('Server Error!..')
    }
})

// @route PUT api/posts/like/:id
// @desc Like a Post
// @access Private

routes.put('/like/:id', Auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        //check if the post is already been liked by user
        // console.log(post);
        if(post.likes.filter(like =>like.user.toString()=== req.user.id).length>0){
            return res.status(400).json({msg:'User already liked!..'})
        }

        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..')
    }
})

// @route PUT api/posts/unlike/:id
// @desc UnLike a Post
// @access Private

routes.put('/unlike/:id', Auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        //check if the post is already been liked by user
        // console.log(post);
        if(post.likes.filter(like =>like.user.toString()=== req.user.id).length === 0){
            return res.status(400).json({msg:'User has not yet been liked post!..'})
        }

        // Get removed Index
        const removedIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removedIndex,1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..')
    }
})


// @route POST api/posts/comment/:id
// @desc Comment on a post
// @access Private

routes.post('/comment/:id', [Auth,[
    check('text','Text field is Required!..').not().isEmpty()
]], async(req,res)=>{
   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors:errors.array()});
    }

   
    try {

        const user = await User.findById(req.user.id).select('-password');

        const post = await Post.findById(req.params.id);

        const newComment = {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..');
    }

});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment
// @access Private

routes.delete('/comment/:id/:comment_id', Auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        console.log(comment);
        // make sure comment exits

        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        }

        // Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        // console.log(post.comments);
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);

        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error!..');
    }
});


module.exports = routes;