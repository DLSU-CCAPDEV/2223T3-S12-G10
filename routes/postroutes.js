
// import module `express`
const express = require('express');
const postController = require('../controllers/postController.js');

const router = express.Router();

router.get('/questions', postController.getManyPosts);
router.get('/post/:_id', postController.getOnePost);
router.get('/post/:_id', postController.getOnePost);
router.post('/post/postComment', postController.postComment);
router.post('/post/replyComment', postController.postReply);
router.post('/post/editPost', postController.updatePost);
router.post('/post/editReply', postController.updateReply);

// router.get('/posting', postController.getPosting);

router.post('/', postController.postPost)
router.post('/questions', postController.getManyPosts);

// router.post('/post', postController.postPost);

// router.get('/post/:_id', postController.getOnePost);

router.get('/search?:postSearch', postController.getSearchedPosts);
router.get('/getReplies', postController.getReplies);

// router.get('/successPost', postController.getSuccessPost)

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = router;
