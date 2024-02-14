const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")

const router = express.Router()

module.exports = function(authMiddleware){
    router.post("/fork",authMiddleware, async function(req, res){
        const {task,type} = req.body;
        const user = req.user
        if(user){
            await prisma.fork.create({data: {path:task,user: user,task: task,type:type}})
        }
    })
    router.get("/fork", async function(req, res){

    })
    return router
}
