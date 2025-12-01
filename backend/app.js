import app from "./src/v1/main.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const developmentType = process.env.NODE_ENV;

const orange = "\x1b[33m"; 
const cyan = "\x1b[36m"; 
const reset = "\x1b[0m";

app.listen(PORT, () => {
  console.log(
    `\n${orange}${developmentType} server is running on port ${PORT} to access it follow this link ${cyan}http://localhost:${PORT}${reset}\n`
  );
});
