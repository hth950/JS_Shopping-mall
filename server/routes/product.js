const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product')

//=================================
//             Product
//=================================


//multer
var storage = multer.diskStorage({
    //파일 저장 경로(desrinatioin)) , 저장 파일 이름(filename)
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path , fileName: res.req.file.filename })
    })
})

router.post('/', (req, res) => {

    //받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body)

    product.save((err) =>{
        if(err){
            return res.status(400).json({success: false, err})
        }
        return res.status(200).json({success : true})
    })


})

router.post('/products', (req, res) => {

    // product collection 에 들어있는 모든 상품 정보를 가져오기

    Product.find()
    .populate("writer")
    .exec((err, productInfo) =>{
        if (err) return res.status(400).json({success : false, err})
        return res.status(200).json({success : true, productInfo})
    })

})

module.exports = router;
