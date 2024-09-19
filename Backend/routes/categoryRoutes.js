import express from 'express'

const routter = express.Router()

//routes
router.post('create-category',requireSingIn,isAdmin, createCategoryController)



export default router