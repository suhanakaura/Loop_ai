const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function runTest() {
  const response1 = await axios.post(`${BASE_URL}/ingest`, {
    ids: [1, 2, 3, 4, 5],
    priority: 'MEDIUM',
  });
  const id1 = response1.data.ingestion_id;
  console.log('Submitted ingestion:', id1);

  await new Promise(r => setTimeout(r, 4000));

  const response2 = await axios.post(`${BASE_URL}/ingest`, {
    ids: [6, 7, 8, 9],
    priority: 'HIGH',
  });
  const id2 = response2.data.ingestion_id;
  console.log('Submitted ingestion:', id2);

  await new Promise(r => setTimeout(r, 10000));

  const status1 = await axios.get(`${BASE_URL}/status/${id1}`);
  const status2 = await axios.get(`${BASE_URL}/status/${id2}`);

  console.log('Status 1:', JSON.stringify(status1.data, null, 2));
  console.log('Status 2:', JSON.stringify(status2.data, null, 2));
}

runTest();
