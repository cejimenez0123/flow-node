const prisma = require("./db")


async function doTheFollowing(){
    await prisma.user.updateMany({data:{
        created:new Date()
    }})
}
try{
    doTheFollowing()
}catch(e){
    console.log(e)
}