import { connect } from 'mongoose';

export default connect(process.env.DATABASE_API_KEY!)
.then(() => {
    console.log('Database connected successfully')
})
.catch((err: any) => {
    console.error(err)
})
