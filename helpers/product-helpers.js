const { resolve, reject } = require('promise')
var db=require('../config/connection')
var collection=require('../config/collections')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
module.exports={
    addProduct:(products,callback)=>{
        products.price=parseInt(products.price)
        db.get().collection('products').insertOne(products).then((data)=>{
           
            callback(data.ops[0]._id)

        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })

    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })

    },
    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })

    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response)
                resolve(response)
            })
        })
    },
    getProductDatails:(proId)=>{

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },getAllAuthors:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            console.log(",,,,,,,,,,,,,,,,",products);
            resolve(products)
        })

    },
    updateProduct:(proId,proDetails)=>{
        products.price=parseInt(products.price)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    name:proDetails.name,
                    catogary:proDetails.catogary,
                    price:proDetails.price,
                    describtion:proDetails.describtion
                    
                }
    }).then((response)=>{
        resolve()
})
        })
    }
}

   
       