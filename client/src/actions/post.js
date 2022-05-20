import axios from 'axios';
import {setAlert} from './alert';
import {DELETE_POST,ADD_POST,GET_POSTS,POST_ERROR, UPDATE_LIKES,GET_POST,ADD_COMMENT,REMOVE_COMMENT} from './types';

// Get Posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
} 

// Like a post
export const likePost = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{id, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
} 

// Dislike a post
export const disLikePost = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);
        dispatch({
            type:UPDATE_LIKES,
            payload:{id, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
} 

//Delete post

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({
            type:DELETE_POST,
            payload:id
        })
        dispatch(setAlert('Post Removed','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
} 

// Add a post

export const addPost = formData => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post('/api/posts',formData,config);
        dispatch({
            type:ADD_POST,
            payload:res.data
        })

        dispatch(setAlert('Post Added!','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
}

// Get Post
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type:GET_POST,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
} 

// Add a comment

export const addComment = (postID,formData) => async dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    try {
        const res = await axios.post(`/api/posts/comment/${postID}`,formData,config);
        dispatch({
            type:ADD_COMMENT,
            payload:res.data
        })

        dispatch(setAlert('Comment Added!','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
}

// Delete a comment

export const deleteComment = (postID,commentID) => async dispatch => {
    try {
        await axios.delete(`/api/posts/comment/${postID}/${commentID}`);
        dispatch({
            type:REMOVE_COMMENT,
            payload:commentID
        })

        dispatch(setAlert('Comment Removed!','success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:err.response.statusText, status:err.response.status}
        })
    }
}