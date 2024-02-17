const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db");

const router = express.Router()

module.exports = function(authMiddleware){

    router.post("/",authMiddleware,async (req,res)=>{
            const {fork,task}=req.body
            const user = req.user
            const newFork = await prisma.fork.create({
                data: {
                    name: task,
                    user:{
                        connect:{
                            id: user.id
                        }
                    },
                    parent:{
                        connect:{
                            id: fork.id
                        }
                    }
                }})

         res.json(newFork)
        })

        router.get("/",async (req,res)=>{
            const fork = await prisma.fork.findUnique({where:{
                id: "65ce6f093ed66e8a5da96c07"
            }})
            res.json(fork)

        })
        router.get("/children/:id", async (req,res)=>{
            const {id} = req.params
            const forks = await prisma.fork.findMany({where:{
               AND: {
                    parentId: id,
                }
                    
            }})
            res.json(forks)
        })
        router.get("/protected/children/:id",authMiddleware,async (req, res) => {

            const {id} = req.params
            const forks = await prisma.fork.findMany({
                where: {
                    AND:{
                        parentId: id,
                        userId: req.user.id
                    }
                }})
            res.json(forks)

        })
    return router
}
