import 'dotenv/config';
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from 'socket.io';
import { onSuccess, validateEnvVariables } from "./utils/index.js";
import { dbconnection } from './config/index.js';
import { textareaContent } from './models/document.js';
textareaContent
const app = express();
dbconnection()
const server = http.createServer(app);
app.use(cors());
validateEnvVariables();
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
let document = {
    content: '',
};
const userCursors = {};
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.emit('load-document', document.content);
    socket.on('text-change', async (newContent) => {
        document.content = newContent;
        const lastUpdatedBy = socket.id;
        await textareaContent.findOneAndUpdate(
            {},
            { content: newContent, last_updated_by: lastUpdatedBy },
            { upsert: true, new: true }
        );
        socket.broadcast.emit('receive-text-change', newContent);
    });
    socket.on('update-cursor', (cursorPosition) => {
        userCursors[socket.id] = cursorPosition;
        socket.broadcast.emit('cursor-update', { userId: socket.id, position: cursorPosition });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userCursors[socket.id];
    });
});

app.get("/", (req, res) => {
    return onSuccess(res, 200, "realtime-doc server gate.")
})

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
