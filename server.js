import express from "express";
import { ICD10 } from "./ICD10.js";

const app = express();

app.use(express.json());

const icd10 = new ICD10();
icd10.init();

app.get("/", (req, res) => {
  res.json({
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
  });
});

app.get("/api/icd-10/:id", async (req, res) => {
  const data = await icd10.findById(req.params.id);
  res.json(data);
});

app.get("/api/icd-10/code/:code", async (req, res) => {
  const data = await icd10.findByCode(req.params.code);
  res.json(data);
});

app.get("/api/icd-10/search/:query", async (req, res) => {
  const data = await icd10.findByQuery(req.params.query);
  res.json(data);
});

app.use((err, req, res, next) => {
  console.log("error");
});

app.listen(3000, () => {
  console.log("App run on port 3000");
});
