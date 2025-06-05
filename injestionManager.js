const { ingestionMap, batchQueue } = require('./store');
const { uuidv4, sleep } = require('./utils');

const PRIORITY_ORDER = { HIGH: 1, MEDIUM: 2, LOW: 3 };

function enqueueIngestion(ids, priority) {
  const ingestion_id = uuidv4();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch_id = uuidv4();
    const batch = {
      batch_id,
      ids: batch_ids,
      status: 'yet_to_start',
      created_time: Date.now(),
      priority,
      ingestion_id,
    };
    batches.push(batch);
    batchQueue.push(batch);
  }

  ingestionMap[ingestion_id] = { status: 'yet_to_start', batches };
  return ingestion_id;
}

function getStatus(ingestion_id) {
  const entry = ingestionMap[ingestion_id];
  if (!entry) return null;

  const allStatuses = entry.batches.map((b) => b.status);
  if (allStatuses.every((s) => s === 'yet_to_start')) entry.status = 'yet_to_start';
  else if (allStatuses.every((s) => s === 'completed')) entry.status = 'completed';
  else entry.status = 'triggered';

  return {
    ingestion_id,
    status: entry.status,
    batches: entry.batches.map((b) => ({
      batch_id: b.batch_id,
      ids: b.ids,
      status: b.status,
    })),
  };
}

// Process 1 batch every 5 seconds
setInterval(async () => {
  if (batchQueue.length === 0) return;

  // Sort by priority then time
  batchQueue.sort((a, b) => {
    const p1 = PRIORITY_ORDER[a.priority];
    const p2 = PRIORITY_ORDER[b.priority];
    return p1 !== p2 ? p1 - p2 : a.created_time - b.created_time;
  });

  const batch = batchQueue.shift();
  batch.status = 'triggered';
  ingestionMap[batch.ingestion_id].batches.find(b => b.batch_id === batch.batch_id).status = 'triggered';

  console.log(`Processing batch: ${batch.batch_id} with IDs: ${batch.ids}`);
  await sleep(3000); // simulate external API delay
  batch.status = 'completed';
  ingestionMap[batch.ingestion_id].batches.find(b => b.batch_id === batch.batch_id).status = 'completed';
  console.log(`Completed batch: ${batch.batch_id}`);
}, 5000);

module.exports = { enqueueIngestion, getStatus };
