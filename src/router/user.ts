import { Request, Response, NextFunction, Router } from 'express';
import { validationResult } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import Cloudinary from '../config/cloudinary';
import { user } from '../middleware/validation/user';
import User from '../model/user';
const router: Router = Router()


/**
 * @url: http://localhost:2000/api/user/total
 * @method: POST
 */

 router.post('/', user, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const userCheck: any = await User.findOne({ email: req.body.email });
        if(userCheck) {
            return res.status(400).json({
                statusCode: res.statusCode,
                msg: 'Email already exists please enter another email address.'
            }) 
        }
        else {
            const uploadImg:any = await req.files?.signleImg;
            if(uploadImg.tempFilePath) {
                const imgData = await Cloudinary.uploader.upload(uploadImg.tempFilePath);
                const user: any = await new User({
                    name: req.body.name,
                    email: req.body.email,
                    img_url: imgData.secure_url,
                    img_publicId: imgData.public_id,
                    category: req.body.category
                }).save();
                return res.status(201).json({
                    statusCode: res.statusCode,
                    data: user
                })                
            }
            else {
                const user: any = await new User({
                    name: req.body.name,
                    email: req.body.email,
                    category: req.body.category
                }).save();
                return res.status(201).json({
                    statusCode: res.statusCode,
                    data: user
                })     
            }
        }
    }
    catch(err: any) {
        next(err);
    }
})



/**
 * @url: http://localhost:2000/api/user/total
 * @method: GET
 */

 router.get('/total', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = await User.find().count();
        return res.status(200).json({
            statusCode: res.statusCode,
            data: user
        })
    }
    catch(err: any) {
        next(err);
    }
})

/**
 * @url: http://localhost:2000/api/user/{{user_id}}
 * @method: PATCH
 */

router.patch('/:user_id', user, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        if(!isValidObjectId(req.params.user_id)) {
            return res.status(404).json({
                statusCode: res.statusCode,
                msg: 'User doesnt exists'
            })
        }
        else {
            const user: any = await User.findById(req.params.user_id);
            if(!user) {
                return res.status(404).json({
                    statusCode: res.statusCode,
                    msg: 'User doesnt exists'
                })
            }
            else {
                const uploadImg:any = await req.files?.signleImg;
                if(uploadImg.tempFilePath) {
                    const imgData: any = await Cloudinary.uploader.upload(uploadImg.tempFilePath, { public_id: user.img_publicId });
                    const data: any = await User.findByIdAndUpdate(req.params.user_id, 
                        { img_url: imgData.secure_url, img_publicId: imgData.public_id, name: req.body.name, email: req.body.email, category: req.body.category },
                        { new: true });
                        return res.status(200).json({
                            statusCode: res.statusCode,
                            data
                        })
                }
                else {
                    const data: any = await User.findByIdAndUpdate(req.params.user_id, 
                        { name: req.body.name, email: req.body.email, category: req.body.category },
                        { new: true })

                        return res.status(200).json({
                            statusCode: res.statusCode,
                            data
                        })
                }
            }
        }
    }
    catch(err: any) {
        next(err)
    }
})

/**
 * @url: http://localhost:2000/api/user/{{user_id}}
 * @method: GET
 */

router.get('/:user_id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!isValidObjectId(req.params.user_id)) {
            return res.status(404).json({
                statusCode: res.statusCode,
                msg: 'User not found.'
            })
        }
        else {
            const user: any = await User.findById(req.params.user_id);
            if(user) {
                return res.status(200).json({
                    statusCode: res.statusCode,
                    user,
                })
            }   
            else {
                return res.status(404).json({
                    statusCode: res.statusCode,
                    msg: 'User not found.'
                })
            }
        }
    }
    catch(err: any) {
        next(err)
    }
})

/**
 * @url: http://localhost:2000/api/user
 * @method: GET
 */

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = await User.find();
        if(user) {
            return res.status(200).json({
                statusCode: res.statusCode,
                data: user
            })
        }
        else {
            return res.status(400).json({
                statusCode: res.statusCode,
                msg: 'No user add still yet' 
            })
        }
    }
    catch(err: any) {
        next(err);
    }
})

/**
 * @url: http://localhost:2000/api/user/{{user_id}}
 * @method: DELETE
 */
router.delete('/:user_id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = await User.findById(req.params.user_id);
        if(isValidObjectId(req.params.user_id && user)) {
            if(user?.img_publicId) {
                const cloudinary: any = await Cloudinary.uploader.destroy(user.img_publicId);
                const data: any = await User.findByIdAndDelete(req.params.user_id)
                return res.status(200).json({
                    statusCode: res.statusCode,
                    data,
                    msg: 'User deleted successfully.'
                })
            }
            else {
                const data: any = await User.findByIdAndDelete(req.params.user_id)
                return res.status(200).json({
                    statusCode: res.statusCode,
                    data,
                    msg: 'User deleted successfully.'
                })   
            }
        }
        else {
            return res.status(400).json({
                statusCode: res.statusCode,
                msg: 'Invalid mongodb id'
            })
        }
    }
    catch(err: any) {
        next(err);
    }
})

export = router;