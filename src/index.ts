import server from "./app";
import { PORT } from "./config";
import dbConnection from "./config/db";

const startServer = async () => {
  await dbConnection();

  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer();
