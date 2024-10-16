import { textareaContent } from '../models/document.js';

let document = { content: '' };
let userCursors = {};
let userSelections = {};
let activeUsers = {}; 
export const handleSocketConnection = (socket, io) => {
  console.log('A user connected:', socket.id);

activeUsers[socket.id] = { id: socket.id, connected: true, name: `User ${socket.id}` }; 


io.emit('active-users', Object.values(activeUsers)); 

  socket.emit('load-document', document.content);

  socket.on('text-change', async ({ content, cursorPosition }) => {
    document.content = content;
    const lastUpdatedBy = socket.id;

    await textareaContent.findOneAndUpdate(
      {},
      { content: content, last_updated_by: lastUpdatedBy },
      { upsert: true, new: true }
    );

    socket.broadcast.emit('receive-text-change', {
      content,
      cursorPosition,
      userId: socket.id,
    });
  });

  socket.on('update-cursor', (cursorPosition) => {
    userCursors[socket.id] = cursorPosition;

    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      position: cursorPosition,
    });
  });

  socket.on('selection-change', ({ selectionStart, selectionEnd }) => {
    userSelections[socket.id] = { selectionStart, selectionEnd };

    socket.broadcast.emit('selection-update', {
      userId: socket.id,
      selectionStart,
      selectionEnd,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    delete userCursors[socket.id];
    delete userSelections[socket.id];

    socket.broadcast.emit('user-disconnected', { userId: socket.id });
  });
};
