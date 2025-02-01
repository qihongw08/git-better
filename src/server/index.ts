import express from 'express';
import routes from './routes';

const app = express();
const PORT = 3001; 

app.use(express.json());
app.use("/api", routes);

export function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}