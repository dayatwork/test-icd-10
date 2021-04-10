import csv from "csv-parser";
import Redis from "ioredis";

import fs from "fs";

const r = new Redis({
  port: 19332, // Redis port
  host: "redis-19332.c1.ap-southeast-1-1.ec2.cloud.redislabs.com", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "ke6I4gle1B4IIyhVUalFONkD4fVL5qPf",
});
const p = r.pipeline();

fs.createReadStream("./example.csv")
  .pipe(csv())
  .on("data", (data) => {
    let key = `icd-10:${data.code}`;
    p.hset(key, data.code, data.name);
  })
  .on("end", () => {
    p.exec();
    r.quit();
  });
