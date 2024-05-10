// const express = require('express');
// const prisma = require("../db");
// const queryString = require("query-string")
// const router = express.Router()

// module.exports = function(authMiddleware){
//     const API_URL = `https://places.googleapis.com/v1/places/GyuEmsRBfy61i59si0?fields=addressComponents&key=${process.env.GOOGLE_MAP_API_KEY}`
//     const TEXT_SEARCH_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json`

//     router.post("/",async (req,res)=>{
//      https://maps.googleapis.com/maps/api/place/textsearch/json
//      let query = queryString.stringify(req.body.query)
//         TEXT_SEARCH_URL+"?query="+query+ "&key="+process.env.GOOGLE_MAP_API_KEY

//     })
//     return router
// }
