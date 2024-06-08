const express = require('express');
const prisma = require("../db");
const bucket = require("../gstorage")
const router = express.Router()

module.exports = function(authMiddleware){
    router.post("/",authMiddleware, async (req,res)=>{
            const {parentFork,task,completed,dueDate,link}=req.body
            let truthy = null
            if(dueDate!==null){
                truthy=false
            }else{
                truthy= completed
            }
            const user = req.user
            const newFork = await prisma.fork.create({
                data: {
                    name: task,
                    dueDate:dueDate,
                    completed:truthy,
                    link:link,
                    user:{
                        connect:{
                            id: user.id
                        }
                    },
                    parent:{
                        connect:{
                            id: parentFork.id
                        }
                    }
                }})
                res.json(newFork)
        })
        router.post("/admin",authMiddleware, async (req,res)=>{
            const {parentFork,task,completed,dueDate,link}=req.body
            let truthy = null
            if(dueDate!==null){
                truthy=false
            }else{
                truthy= completed
            }
            
            const newFork = await prisma.fork.create({
                data: {
                    name: task,
                    dueDate:dueDate,
                    completed:truthy,
                    link:link,
                    userId:null,
                    parent:{
                        connect:{
                            id: parentFork.id
                        }
                    }
                }})
                res.json(newFork)
        })
        router.delete("/children/:id",authMiddleware,async (req,res)=>{
            await prisma.fork.delete({
                where: {
                    id: req.params.id
                },
              })
            res.status(201).json({message:"Deleted Successfully"})
        })
        router.put("/:id" ,authMiddleware,async (req,res)=>{
            const id = req.params.id
            const { completed,
                    dueDate,
                    name,
                    style,
                    description }= req.body
            const updateFork = await prisma.fork.update({
                where: {
              
                        id: id, 
                    },
                data: {
                    name: name,
                    completed: completed,
                    dueDate: dueDate,
                    style:style, 
                    description: description??""
                },
              })

            res.json(updateFork)
        })
        router.get("/",async (req,res)=>{
            const fork = await prisma.fork.findUnique({where:
            {id:"65ce6f093ed66e8a5da96c07"}})
            res.json(fork)
        })
        router.get("/children/:id", async (req,res)=>{
            const {id} = req.params
            const forks = await prisma.fork.findMany({where:{
                OR:[{
                    AND:{
                        parentId: id, 
                            userId:null   
                    }

                }

                ]
                // AND:{
                //                 
                // }
        }})

         
            res.json(forks)
        })
        router.post("/file",authMiddleware,async (req,res)=>{
            const {name,file}=req.body
        
            const fileName = `${req.user.id}/${file.name}`
            let bucketFile = bucket.file(fileName)
            bucketFile.createWriteStream({
                metadata: {
                    contentType: 'text/plain', // Adjust content type as needed
                },
            })
            console.log(fileName)
            const downloadFilename = `${name}.${file.type}`
            bucketFile.download({ destination: downloadFilename })
   
            res.json({file: `http://storage.googleapis.com/culper/${fileName}`})
        })
        router.post("/file/admin",authMiddleware,async (req,res)=>{
           console.log(req.body)
            
            const fileName = `admin/${"filename"}`
            // let bucketFile = bucket.file(fileName)
            // bucketFile.createWriteStream({
            //     metadata: {
            //         contentType: 'text/plain', // Adjust content type as needed
            //     },
            // })
            // console.log(fileName)
            // const downloadFilename = `${name}.${file.type}`
            // bucketFile.download({ destination: downloadFilename })
   
            res.json({file: `http://storage.googleapis.com/culper/${fileName}`})
       
        })
        async function findValues(id,next){
            const map = await prisma.fork.findUnique({
                where:{
                    id: id
                },select:{
                    forks: true
                }
            })
            const fork = await prisma.fork.findUnique({where:{id:id}})
            let forks =map.forks
            if(forks.length>0){
                forks.forEach(fork=>findValues(fork.id,(xid)=>{
                     prisma.fork.delete({where:{
                        id: xid
                       }}).then(()=>{
                        next(id)   
                       }) 
                       
                }))
            }else{
                next(fork.id)
            }
        }
        router.delete("/:id",authMiddleware,async (req,res)=>{
            const parentId = req.params.id
            const idList = req.body.idList
           await findValues(parentId,(id)=>{
           prisma.fork.delete({where:{
                id: id
               }}).then(response=>{
                res.status(204).json({message:"Delete Successfully"})
               }).catch(error=>{
                res.status(402).json({message:"Delete Error"})
               })
           })
        
           
        })
        router.get("/children/:id/user",authMiddleware, async (req, res) => {
            const {id} = req.params
            const forks = await prisma.fork.findMany({where:{
                OR:[
                    {AND:{
                    parentId: id,                 
                    userId:req.user.id
                }},{
                    AND:{
                        parentId:id,
                        userId:null
                    }
                }] }})
            res.json(forks)
       })
      
        router.get("/protected/children/:id",authMiddleware,async (req, res) => {

            const {id} = req.params
    
                const forks = await prisma.fork.findMany({
                    where: {
                      OR: [
                        { AND:{
                          parentId:id, 
                          userId: req.user.id
                        }
                        },
                        {
                          AND: {
                            parentId:id,
                            userId: null
                          },
                        },
                       
                      ],
                    },
                  })
            res.json(forks)

        })
    
    return router
}
