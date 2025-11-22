const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'api-gateway' });
});

// Service Routes Configuration
const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    digitalTwin: process.env.DIGITAL_TWIN_SERVICE_URL || 'http://digital-twin-service:3002',
    optimization: process.env.OPTIMIZATION_SERVICE_URL || 'http://optimization-service:3003',
};

// Proxy Rules
app.use('/api/auth', createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/auth', // remove /api/auth prefix when forwarding
    },
}));

app.use('/api/digital-twin', createProxyMiddleware({
    target: services.digitalTwin,
    changeOrigin: true
}));

app.use('/api/optimization', createProxyMiddleware({
    target: services.optimization,
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
