import { createServer } from 'http';
const server = createServer(require('./app'));

server.listen(process.env.PORT || 2000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 2000}`);
})
