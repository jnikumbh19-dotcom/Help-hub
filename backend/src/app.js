import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { successResponse } from './utils/response.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  return successResponse(res, { status: 'OK', message: 'API is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
