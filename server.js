import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const r = new Redis({
  port: 11608,
  host: "redis-11608.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "6eEYrymDcjb6NRCc6Lrunpy50e3vuqko",
});

app.get("/", (req, res) => {
  res.json({
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
  });
});

app.get("/icd-10/:id", async (req, res) => {
  const data = await r.hgetall(`icd-10:${req.params.id}`);
  res.json(data);
});

app.listen(3000, () => {
  console.log("App run on port 3000");
});
