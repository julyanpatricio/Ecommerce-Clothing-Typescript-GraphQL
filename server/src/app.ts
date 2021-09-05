import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes";
import express, { Application, Request, Response, NextFunction } from "express";

// server.name = "API";
const server: Application = express();

interface error {
  status: number;
  message: string;
}

server.use(express.urlencoded({ extended: true, limit: "50mb" })); //middleware
server.use(express.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Agregar rutas
server.use("/", routes);

// Error catching endware.
server.use((err: error, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;
