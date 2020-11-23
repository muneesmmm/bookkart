const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers= require('../helpers/product-helpers')
const userHelper=require('../helpers/user-helper')
const verifylogin=(req,res,next)=>{
  if(req.session.userloggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/',async function(req, res) {
  let user=req.session.user
  console.log(user)
  let cartCount=null 
  if(req.session.user){
   cartCount=await userHelper.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
  res.render('user/view_products',{user,products,cartCount})
  })
})
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/login',{"loginErr":req.session.userloginErr})
    req.session.userloginErr=false
  }  
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.user=response
    req.session.userloggedIn=true
    res.redirect('/')
  })
  })
router.post('/login',(req,res)=>{
userHelper.doLogin(req.body).then((response)=>{
  if(response.user['type']==='admin'){
    req.session.user=response.user
    req.session.userloggedIn=true
    res.redirect('/admin')
  }
  if(response.status){
    req.session.user=response.user
    req.session.userloggedIn=true

    res.redirect('/')
  }else{
    req.session.userloginErr="invalid username & password"
    res.redirect('/login')
  }
})
})
router.get('/logout',(req,res)=>{
  req.session.userloggedIn=false
  req.session.user=null
  res.redirect('/')
})
router.get('/cart',verifylogin,async(req,res)=>{
  let products=await userHelper.getCartProducts(req.session.user._id)
  let totalValue=await userHelper.getTotalAmount(req.session.user._id)
  console.log(products)
  console.log(req.session.user._id)
  res.render('user/cart',{products,user:req.session.user._id,totalValue})
})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log("api call") 
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
   res.json({status:true}); 
  })
})
router.post('/change-product-qty',(req,res,next)=>{
  console.log(req.body)
  userHelper.changeQty(req.body).then(async(response)=>{
    response.total=await userHelper.getTotalAmount(req.body.user)
     res.json(response)
  })
})
router.post('/delete-Pro',(req,res,next)=>{
  console.log(req.body)
  userHelper.deleteProd(req.body).then((response)=>{
     res.json(response)
  })

})
router.get('/place-order',verifylogin, async(req,res)=>{
  let total=await userHelper.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/place-order',async (req,res)=>{
  console.log(req.body);
  let products=await userHelper.getCartProductList(req.body.userid)
  let totalPrice=await userHelper.getTotalAmount(req.body.userid)
  userHelper.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method']==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelper.generateRazorpay(orderId,totalPrice).then((response)=>{
        
        res.json(response)
      })
    }

    
  })
  console.log(req.body);
})

router.get('/order-success',(req,res)=>{
  res.render('user/order-success',{user:req.session.user})
  
})
router.get('/orders',async(req,res)=>{
  let orders=await userHelper.getAllorders(req.session.user._id)
  res.render('user/orders',{user:req.session.user,orders})
})
router.get('/view-orders/:id',async(req,res)=>{
  let products=await userHelper.getAllordersProducts(req.params.id)
  res.render('user/view-orders',{user:req.session.user,products})
  console.log(products,'...........................')

})
router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
})
router.get('/authors', function(req, res, next) {
  productHelpers.getAllAuthors().then((products)=>{    
    res.render('user/authors',{products})
  })
  
});
module.exports = router;
  