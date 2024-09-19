import categoryModel from "../models/categoryModel"

export const createCategoryController = () => {
    try {
        const {name} = req.body
        if(!name){
            return.res.status(401).send({message:'Name is required'})
        }
        const exisitingCategory = await categoryModel.findOne({name}) 
        if(exisitingCategory){
            return res.status(200).send({
                success:true,
                message:'Category is '
            })
        } 

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Errro in category'
        })
    }
}