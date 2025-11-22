const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const models = require('./models');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'healthy', service: 'collaboration-service' });
});

// Partners API
app.get('/partners', (req, res) => {
    const partners = models.getPartners();
    res.json(partners);
});

app.post('/partners/invite', (req, res) => {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const result = models.invitePartner(email, role);
    res.json(result);
});

// Exceptions API
app.get('/exceptions', (req, res) => {
    const exceptions = models.getExceptions();
    res.json(exceptions);
});

app.post('/exceptions', (req, res) => {
    const { title, description, type, severity, assignedTo } = req.body;
    if (!title || !type) return res.status(400).json({ error: 'Missing required fields' });

    const exception = models.createException({ title, description, type, severity, assignedTo });
    res.status(201).json(exception);
});

app.post('/exceptions/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text, author } = req.body;

    const comment = models.addComment(id, text, author || 'User');
    if (!comment) return res.status(404).json({ error: 'Exception not found' });

    res.status(201).json(comment);
});

app.listen(PORT, () => {
    console.log(`Collaboration Service running on port ${PORT}`);
});
