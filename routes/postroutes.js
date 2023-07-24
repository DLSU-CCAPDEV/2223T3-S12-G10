
// import module `express`
const express = require('express');
const postController = require('../controllers/postController.js');

const router = express.Router();

router.get('/questions', postController.getManyPosts);
router.get('/post/:_id', postController.getOnePost);
router.post('/post/postComment', postController.postComment);

// router.get('/posting', postController.getPosting);

router.post('/posting', postController.postPost)

// router.post('/post', postController.postPost);

// router.get('/post/:_id', postController.getOnePost);

router.get('/search/:postSearch', postController.searchPost);



// router.get('/successPost', postController.getSuccessPost)

/*
    exports the object `app` (defined above)
    when another script exports from this file
*/
module.exports = router;
