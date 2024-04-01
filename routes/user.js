
const express = require('express');
const prisma = require("../db");

const router = express.Router()

module.exports = function(authMiddleware){

    router.put("/",authMiddleware,async (req,res)=>{
        const {style}=req.body
        const updateUser = await prisma.user.update({
            where: {
          
                    id: req.user.id 
                },
            data: {
               style: style
            },
          })

        res.json(updateUser)

    })
    return router
}