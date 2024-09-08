import { Request, Response } from "express";
import { dbConnect } from "./database/index.database";
import { app, httpServer } from "./socket.io/index.socket";

dbConnect();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ message: "home page", statusCode: 200 });
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT ?? 3000}`
  );
});
