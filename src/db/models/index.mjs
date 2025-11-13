import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import process from "process";
import { pathToFileURL, fileURLToPath } from "url";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";
const config = (await import("../config/config.mjs")).default[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.endsWith(".js") || file.endsWith(".mjs")) &&
      !file.endsWith(".test.js")
    );
  });

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const modelModule = await import(pathToFileURL(filePath));
  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;