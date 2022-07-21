import express, { Request, Response, NextFunction, json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import  upload, { UploadedFile } from 'express-fileupload';
import 'dotenv/config';
import { join } from 'path';
import('./config/db');
const app = express();

// configuration
app.use(cors())
app.use(morgan('dev'));
app.use(json());
app.use(upload({
    useTempFiles: true,
    tempFileDir: join(__dirname, './img')
}));
app.use(urlencoded({ extended: false }))

// Router
app.use('/api/user', require('./router/user'));

app.post('/api/test', (req: Request, res: Response, next: NextFunction) => {
    try {
        const imgData:any = req.files?.img;
        console.log(imgData.name)
    }
    catch(err: any) {
        next(err)
    }
})

// 404 error handling
app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        statusCode: res.statusCode,
        msg: 'Invalid Api.'
    })
})

// 500 error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.status(500).json({
        statusCode: res.statusCode,
        err: err.message || 'Sorry internal server error please try after sometime. '
    })
})

export = app;