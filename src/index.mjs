import express from 'express';
import db from "./db/models/index.mjs";
import route from "./routes/route.mjs";


const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(express.json());
app.use(route);

app.listen(PORT, async () => {
  await db.sequelize.sync({ alter: true });
  console.log(`Running on Port ${PORT}`);
});