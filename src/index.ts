import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "dotenv";
import "module-alias/register.js";

import AuthRoute from "@/route/auth.route.js";
import UsersRoute from "@/route/users.route.js";
import ArticlesRoute from "@/route/articles.route.js";
import CategoriesRoute from "@/route/categories.route.js";
import * as Middleware from "@/middleware/route.middleware.js";

config();

const PORT = process.env.PORT;
const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(helmet());
app.use(compression());

app.use("/api/v1", AuthRoute);
app.use("/api/v1", ArticlesRoute);
app.use("/api/v1", UsersRoute);
app.use("/api/v1", CategoriesRoute);
app.use("/", Middleware.routeNotFound);

app.listen(PORT, () => {
  console.log(`Server start on http://localhost:${PORT}`);
});
