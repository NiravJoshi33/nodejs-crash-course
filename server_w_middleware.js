import { createServer } from "http";
const PORT = 8000;

const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Jim Doe" },
];

// Logger middleware
function logger(req, res, next) {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
}

// JSON middleware
function jsonMiddleware(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
}

function getHomePageHandler(req, res) {
  res.write(JSON.stringify({ message: "Hello World" }));
  res.end();
}

// Route Handler for GET api/users
function getUsersHandler(req, res) {
  res.write(JSON.stringify(users));
  res.end();
}

function createUserHandler(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const user = JSON.parse(body);
    users.push(user);
    res.statusCode = 201;
    res.write(JSON.stringify({ message: "User created" }));
    res.end();
  });
}

// Route handler for GET /api/users/:id
const getUserByIdHandler = (req, res) => {
  const id = req.url.split("/")[3];
  const user = users.find((user) => user.id === parseInt(id));

  if (user) {
    res.write(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ message: "User not found" }));
  }
  res.end();
};

// Not found handler
const notFoundHandler = (req, res) => {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: "Route not found" }));
  res.end();
};

const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.url === "/" && req.method === "GET") {
        getHomePageHandler(req, res);
      } else if (req.url === "/api/users" && req.method === "GET") {
        getUsersHandler(req, res);
      } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "GET"
      ) {
        getUserByIdHandler(req, res);
      } else if (req.url === "api/users" && req.method === "POST") {
        createUserHandler(req, res);
      } else {
        notFoundHandler(req, res);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
