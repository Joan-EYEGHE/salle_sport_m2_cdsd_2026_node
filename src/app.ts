import cors from "cors";
import express from "express";
import router from "./routes";
import { errorHandler } from "./utils/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/users', routerUser);
// app.use('/api/tickets', routerTicket);
app.use('/api', router);


app.use(errorHandler);

export default app;