import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import { connectDB } from "./config/db.js";

console.log("URI:", process.env.MONGO_URI); // <-- aqui em cima

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
