import csv from "csv-parser";
import Redis from "ioredis";

import fs from "fs";

const r = new Redis({
  port: 11608,
  host: "redis-11608.c252.ap-southeast-1-1.ec2.cloud.redislabs.com",
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "6eEYrymDcjb6NRCc6Lrunpy50e3vuqko",
});
const p = r.pipeline();

fs.createReadStream("./ICD-10.csv")
  .pipe(csv())
  .on("data", (data) => {
    let key = `icd-10:${data.code}`;
    p.hset(key, "code", data.code, "name", data.name);
  })
  .on("end", () => {
    p.exec();
    r.quit();
  });
