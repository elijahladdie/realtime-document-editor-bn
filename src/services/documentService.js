import { textareaContent } from '../models/document.js';

let document = { content: '' };
let userCursors = {};
let userSelections = {};
let activeUsers = {}; // New: Store active users

export const handleSocketConnection = (socket, io) => {
  console.log('A user connected:', socket.id);
// Add the connected user to the active users list
activeUsers[socket.id] = { id: socket.id, connected: true, name: `User ${socket.id}` }; 

// Broadcast the updated list of active users to all clients
io.emit('active-users', Object.values(activeUsers)); 

  // Send the initial document content to the connected user
  socket.emit('load-document', document.content);

  // Handle text changes from the user
  socket.on('text-change', async ({ content, cursorPosition }) => {
    document.content = content;
    const lastUpdatedBy = socket.id;

    // Store the updated document content and user info in the database
    await textareaContent.findOneAndUpdate(
      {},
      { content: content, last_updated_by: lastUpdatedBy },
      { upsert: true, new: true }
    );

    // Broadcast the text change and cursor position to all other users
    socket.broadcast.emit('receive-text-change', {
      content,
      cursorPosition,
      userId: socket.id,
    });
  });

  // Handle cursor updates from the user
  socket.on('update-cursor', (cursorPosition) => {
    userCursors[socket.id] = cursorPosition;

    // Broadcast the cursor position to all other users
    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      position: cursorPosition,
    });
  });

  // Handle text selection updates from the user
  socket.on('selection-change', ({ selectionStart, selectionEnd }) => {
    userSelections[socket.id] = { selectionStart, selectionEnd };

    // Broadcast the text selection range to all other users
    socket.broadcast.emit('selection-update', {
      userId: socket.id,
      selectionStart,
      selectionEnd,
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the disconnected user's cursor and selection data
    delete userCursors[socket.id];
    delete userSelections[socket.id];

    // Optionally broadcast that a user has disconnected (if you want)
    socket.broadcast.emit('user-disconnected', { userId: socket.id });
  });
};
