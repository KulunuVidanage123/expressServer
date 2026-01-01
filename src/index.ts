// src/index.ts
import express from 'express';
import { connectDb } from './config/db.config';
import { APPLICATION } from './config/app.config';
import cors from 'cors';

const app = express();
const port = APPLICATION.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json());

connectDb();

import routes from './routes';
app.use('/api', routes);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running in ${APPLICATION.NODE_ENV} mode on http://localhost:${port}`);
});