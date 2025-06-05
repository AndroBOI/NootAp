
import express from 'express';
import { connectDB } from '../backend/config/db.js';
import appRoutes from '../backend/routes/appRoutes.js'
import cors from 'cors'

const app = express();

app.use(cors())

app.use(express.json());

connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

app.use('/app', appRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
