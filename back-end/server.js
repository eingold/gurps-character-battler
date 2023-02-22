import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { router as manoeuvre } from "./routes/manoeuvre.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use("/manoeuvre", manoeuvre);

// const httpsOptions = {
//     key: fs.readFileSync(process.env.SERVER_KEY),
//     cert: fs.readFileSync(process.env.SERVER_CERT)
// }

//HTTPS - not currently working properly
// const server = https.createServer(httpsOptions, app).listen(port, host, () => {
//     const SERVERHOST = server.address().address;
//     const SERVERPORT = server.address().port;
//     console.log(`App listening on https://${SERVERHOST}:${SERVERPORT}`);
// });

//HTTP
const server = app.listen(port, () => {
    const SERVERHOST = server.address().address;
    const SERVERPORT = server.address().port;
    console.log(`App listening on http://${SERVERHOST}:${SERVERPORT}`);
});

export default server;