const { response } = require('express');
var express = require('express');
const productHelpers= require('../helpers/product-helpers')
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    
    res.render('admin/view-products',{admin:true,products})
  })
  
});
router.get('/all-users', function(req, res, next) {
  productHelpers.getAllUsers().then((users)=>{
    res.render('admin/all-users',{users})
  })
  
});
router.get('/all-orders', function(req, res, next) {
  productHelpers.getAllOrders().then((orders)=>{
    res.render('admin/all-orders',{orders})
  })
  
});

router.get('/add-products',(req,res)=>{
  res.render('admin/add-products')
})
router.post('/add-products',(req,res)=>{
 

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.image
    console.log(id)
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }else{
        console.log(err);
      }
    })
    
  })
})
router.get('/detete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })

})
router.get('/edit-product/:id',async(req,res)=>{
    let product=await productHelpers.getProductDatails(req.params.id)
    console.log(product);
    res.render('admin/edit-product',{product})

  })
  router.post('/edit-product/:id',(req,res)=>{
    productHelpers.updateProduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
      
      if(req.files.image){
        let id=req.params.id
        let image=req.files.image
        image.mv('./public/product-images/'+id+'.jpg')
      }
    })
  })
  
module.exports = router;