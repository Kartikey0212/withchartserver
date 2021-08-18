import express from "express";
import cluster from "cluster";
import { cpus } from "os";
import dotenv from "dotenv";
import { readdirSync } from "fs";
dotenv.config();

const app = express();
const num_cpu = cpus().length;
const PORT = process.env.PORT;


if (cluster.isMaster) {
  console.log(`\x1b[33m Server Started at PORT ${PORT}`)
  for (let i = 0; i < num_cpu/4; i++) {
    cluster.fork();
  }
} 
else {
  app.listen(PORT);

  app.use(express.json());

  readdirSync("./routes").map((r)=> app.use("/api", require(`./routes/${r}`)));

}

// cluster.on("exit", (worker) => {
//   cluster.fork();
// });


