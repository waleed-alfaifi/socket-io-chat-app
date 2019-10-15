io = require('socket.io')();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const Message = require('../models/Message');
// const onlineUsers = [];
const onlineUsers = {};

// Middleware for verifying users.
io.use(auth.socket);

io.on('connection', socket => {
  onSocketConnected(socket);

  socket.on('message', data => onMessage(socket, data));
  socket.on('typing', receiver => onTyping(socket, receiver));
  socket.on('seen', sender => onSeen(socket, sender));

  initialData(socket);

  socket.on('disconnect', () => onSocketDisconnected(socket));
});

const onSocketConnected = socket => {
  const userId = socket.user.id;

  // The user with this socket joins a room only for them.
  socket.join(userId);

  onlineUsers[userId] = true;

  let userRoom = io.sockets.adapter.rooms[userId];
  // Send user's status to other users if it's the first time the user connected.
  if (userRoom.length === 1) {
    io.emit('user_status', {
      [userId]: true,
    });
  }
};

const initialData = socket => {
  const user = socket.user;
  let messages = [];

  getMessages(user.id)
    .then(data => {
      messages = data;
      return getUsers(user.id);
    })
    .then(contacts => {
      socket.emit('data', user, messages, contacts, onlineUsers);
    })
    .catch(err => {
      console.log('initialData error ', err);
      socket.disconnect();
    });
};

const onMessage = async (socket, data) => {
  const sender = socket.user.id;

  const { receiver, content } = data;
  const message = {
    sender,
    receiver,
    content,
    date: new Date().getTime(),
  };

  try {
    await Message.create(message);
    socket
      .to(receiver)
      .to(sender)
      .emit('message', message);
  } catch (error) {
    console.error(error);
  }
};

const onTyping = (socket, receiver) => {
  const sender = socket.user.id;
  socket.to(receiver).emit('typing', sender);
};

const onSeen = (socket, sender) => {
  const receiver = socket.user.id;

  Message.updateMany(
    {
      sender,
      receiver,
      seen: false,
    },
    {
      seen: true,
    },
    {
      multi: true,
    }
  ).exec();
};

onSocketDisconnected = socket => {
  const userId = socket.user.id;
  let userRoom = io.sockets.adapter.rooms[userId];

  if (!userRoom || userRoom.length < 1) {
    let lasSeen = new Date().getTime();
    onlineUsers[userId] = lasSeen;
    io.emit('user_status', {
      [userId]: lasSeen,
    });
  }
};

/* Helper methods */
const getMessages = userId => {
  const conditions = [
    {
      sender: userId,
    },
    {
      receiver: userId,
    },
  ];

  return Message.find().or(conditions);
};

const getUsers = userId => {
  const condition = {
    _id: { $ne: userId },
  };

  return User.find(condition).select('-pw');
};
