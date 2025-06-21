import express from 'express';
import xss from 'xss';
import cors from 'cors';
import compression from "compression";
import morgan from "morgan";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path, { resolve } from "path";
import chalk from "chalk";
import NodeCache from 'node-cache';
import { connectDB } from "./config/connectDB.js";
import fileUpload from "express-fileupload";
import helmet from "helmet";





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: resolve(__dirname, `.env.${process.env.NODE_ENV}`) });
const app = express();
const cache = new NodeCache();

const apiVersion = process.env.API_VERSION;
connectDB(app);


//Environment Info
console.log(
    chalk.green(`
  -----------------------------
  ${chalk.bold("Environment Info:")}
  -----------------------------
  NODE_ENV: ${chalk.cyan(process.env.NODE_ENV)}
  PORT: ${chalk.cyan(process.env.PORT)}
  API_VERSION: ${chalk.cyan(apiVersion)}
  -----------------------------
  `)
);


const allowedOrigins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://localhost",
    "https://livepush.io",
    "http://localhost",
    "http://127.0.0.1",
];

//security middlewares
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) {
                return callback(null, true);
            }
            const isAllowed = allowedOrigins.some((allowedOrigin) =>
                new RegExp(
                    `^${allowedOrigin.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`
                ).test(origin)
            );
            if (isAllowed) {
                callback(null, true);
            } else {
                console.error(`CORS Error: Origin ${origin} is not allowed`);
                callback(new Error(`CORS Error: Origin ${origin} is not allowed`));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);
// app.use(cors({
// origin: '*',
// methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// allowedHeaders: ['Content-Type', 'Authorization'],
// credentials: true
// }));
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log(`Request method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    next();
});

const storageBase = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/app/uploads';


app.get("/", (req, res) => {
    res.send("Always stay wacky 😜");
});

export default app;
