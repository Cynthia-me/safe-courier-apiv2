const express = require('express');
const router = express.Router();
const mongoose = require('../Schemas/model');
const checkAuth = require('../middleware/check_auth');
const adminAuth = require('../middleware/admin_auth');

const { parcelSchema,validation} = require('../Schemas/parcels.js');

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access denied
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     users:
 *        type: object
 *        required:
 *          - firstName
 *          - lasttName
 *          - mail
 *          - pwd
 *        properties:
 *          name:
 *            type: string
 *          mail:
 *            type: string
 *            format: email
 *     login:
 *        type: object
 *        required:
 *          - mail
 *          - pwd
 *        properties:
 *          mail:
 *            type: string
 *            format: email
 *          pwd:
 *            type: string
 *            format: password
 *            minLength: 6
 *     signup:
 *        type: object
 *        required:
 *          - firstName
 *          - lasttName
 *          - mail
 *          - pwd
 *        properties:
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          pwd:
 *            type: string
 *            format: password
 *            minLength: 6
 *        example:
 *          firstName: Jane
 *          lastName: Doe
 *          email: janedoe@gmail.com
 *          password: Yiidix#8e
 *     parcels:
 *       type: object
 *       required:  
 *         - parcelItem
 *         - parcelWeight
 *         - From
 *         - To
 *       properties:
 *         parcelItem:
 *           type: string
 *         parcelWeight:
 *           type: string
 *         From:
 *           type: string
 *         To:
 *           type: string
 *       example:
 *         parcelItem: Bag
 *         parcelWeight: 5kg
 *         From: Montreal
 *         To: Mexico
 */

 /**
  * @swagger
  * tags:
  *     name: Parcels
  *     description: The parcels managing API
  */

 /** 
 * @swagger
 * /api/v2/parcels/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: User to place a parcel order
 *     tags: [Parcels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/parcels'             
 *     responses:
 *       201:
 *         description: Parcel placed for delivery
 *       400:
 *         description: Something went wrong
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'         
*/
 
router.post('/',async function(req,res){
    //Validating the data
    const {error} = validation(req.body);
    if(error) {return res.status(400).send(error.details[0].message);}
    
    const newParcel = await new parcelSchema({
        parcelItem : req.body.parcelItem,
        parcelWeight : req.body.parcelWeight,
        From : req.body.From,
        To : req.body.To
    })
       
   try{
        await newParcel.save()
        res.status(201).json({
           newParcel,
           message : "parcel placed for delivery"
       })
    }
    catch(err){
        res.status(400).json({
            message : 'Something went wrong',
        })
        console.log (err)
    }
})

/**
  * @swagger
  * /api/v2/parcels/{parcelId}:
  *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns a specific parcel delivery order by a logged in user
 *     tags: [Parcels]
 *     parameters:
 *       - in: path
 *         name: parcelId
 *         schema:
 *           type: string
 *         required: true
 *         description: This is the parcel id
 *     responses:
 *       200:
 *         description: The specific parcel successfully obtained
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'    
 *       404:
 *         description: Parcel not found     
  */

router.get('/:parcelId',checkAuth,async function(req,res){
   
    const theParcel = await parcelSchema.findById(req.params.parcelId)
    if(!theParcel){
        res.status(404).send(
            "Can not find parcel"
        )
        console.log(error)
    }
    else{
        res.json(theParcel)
    }
});


/**
  * @swagger
  * /api/v2/parcels:
  *   get:
  *     summary : Returns parcels orders made by the user
  *     tags: [Parcels]
  *     responses:
  *       200:
  *         description: List of parcel orders
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items: 
  *                 $ref: '#/components/schemas/parcels'  
  * 
  */


router.get('/',async function(req,res){
    const allParcels = await parcelSchema.find()
    try{
        res.status(200).json({
        allParcels,
        Total : allParcels.length,
        message : "These are all the parcels"
        })
    }
    catch(err){
        res.json({
            error : 'Try again'
        })
        console.log(err)
    }
})

/** 
 * @swagger
 * /api/v2/parcels/{parcelId}/destination:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Destination of the parcel can be changed by the user
 *     tags: [Parcels]
 *     parameters:
 *       - in: path
 *         name: parcelId
 *         schema:
 *           type: string
 *         required: true
 *         description: This is the parcel id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/parcels'
 *     responses:
 *       200:
 *         description: Destination of parcel order has been changed
 *       500:
 *         description: Error changing destination         
*/

router.put('/:parcelId/destination',checkAuth, (req,res)=>{
    parcelSchema.findByIdAndUpdate(req.params.parcelId,req.body).then(
        (result)=>{
            parcelSchema.findOne({_id:req.params.parcelId}).then(
                function(parcel){
                    res.send(parcel);
                }
            )
            console.log(result);
        }
    
    )

    .catch(err=>{
        res.status(500).send({message:"Error changing destination"})
    })
    
})

/** 
 * @swagger
 * /api/v2/parcels/{parcelId}/cancel:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: A specific parcel order can be cancelled by the user
 *     tags: [Parcels]
 *     parameters:
 *       - in: path
 *         name: parcelId
 *         schema:
 *           type: string
 *         required: true
 *         description: This is the parcel id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/Parcels'
 *     responses:
 *       200:
 *         description: Successfull cancel of a parcel order
 *       400:
 *         description: Can not cancel already delivered parcel  
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Parcel not found         
*/
router.put("/:parcelId/cancel", checkAuth, async(req,res) => {
    parcelSchema.findByIdAndUpdate(req.params.parcelId,req.body).then(
        (result)=>{
            parcelSchema.findOne({_id:req.params.parcelId}).then(
                function(parcel){
                    res.send(parcel);
                }
            )
            console.log(result);
        }
    )
    .catch(err=>{
        res.status(500).send({message:"Error update"})
    })
    
})
    
module.exports = router;