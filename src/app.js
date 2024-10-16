import 'dotenv/config';
import http from "http";
import { Server } from 'socket.io';
import { dbconnection } from './config/index.js';
import { handleSocketConnection } from './services/documentService.js';
import { validateEnvVariables } from "./utils/index.js";
import express from "express";
import cors from "cors";
// DB Connection and Env validation

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
validateEnvVariables();
dbconnection();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Realtime document collaboration server running." });
});
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    handleSocketConnection(socket, io);
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
