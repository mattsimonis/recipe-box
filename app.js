const server = require("./server");

const PORT = server.get("port");

require("dotenv").config();

server.listen(PORT, () => {
  process.stdout.write(`App listening on port ${PORT}\n`);
});
