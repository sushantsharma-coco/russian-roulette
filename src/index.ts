import { Request, Response } from "express";
import { mongodbConnect } from "./database/mongodb.database";
import { app, httpServer } from "./socket.io/index.socket";
import { redisClient } from "./lib/cache/redisClient";
import { mysqlConnect } from "./database/mysql.database";
import authRouter from "./routes/auth/user.routes";

mongodbConnect();
// mysqlConnect();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ message: "home page", statusCode: 200 });
});

app.use("/api/v1/auth", authRouter);

httpServer.listen(process.env.PORT || 3000, async () => {
  let x = {
    color: "yellow",
  };
  await redisClient.setToRedis("yellow", x);
  console.log(await redisClient.getFromRedis("yellow"));
  console.log(
    `Server is running at http://localhost:${process.env.PORT ?? 3000}`
  );
});
