const express = require('express');
const bodyParser = require('body-parser');
const { enqueueIngestion, getStatus } = require('./ingestionManager');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
 
app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  if (!Array.isArray(ids) || !priority) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const ingestion_id = enqueueIngestion(ids, priority);
  res.json({ ingestion_id }); 
});

app.get('/status/:id', (req, res) => {
  const ingestion_id = req.params.id;
  const status = getStatus(ingestion_id);
  if (!status) {
    return res.status(404).json({ error: 'Ingestion ID not found' });
  }
  res.json(status);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
