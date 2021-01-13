const req = require("./req");

const request = require("./req");

module.exports = socket => {

  // handle the event sent with socket.send()
  socket.on('message', async (data) => {
    const resp = await request();
    socket.emit('message', resp);
  });

}