import { body } from 'express-validator'

export const user: any = [
    body('name')
    .notEmpty()
    .withMessage('Name is required please enter your name')
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage('Minimum length is 2 and maximum legnth is 30 for the name.'),

    body('email')
    .notEmpty()
    .withMessage('Email is required please enter your email address.')
    .bail()
    .isEmail()
    .withMessage('Invalid address please enter valid email address')
    .bail()
    .isLength({ min: 10, max: 75 })
    .withMessage('Minimum length is 10 and maximum legnth is 75 for the .'),

    body('category')
    .notEmpty()
    .withMessage('Category is required, please enter the category')
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage('Minimum length is 2 and maximum legnth is 30 for the name.')
]