import Airtable from 'airtable';

export default async function handler(req, res) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);


  try {
    // Correctly fetch the first page of records
    const records = base(process.env.AIRTABLE_TABLE_NAME).select({}).firstPage(function (err, records) {
      if (err) { console.error(err); return; }
      records.forEach(function (record) {
        console.log('Retrieved', record.get('Copilot Company ID'));
      });

      // Map records to your tasks structure
      const tasks = records.map(record => ({
        id: record.id,
        ...record.fields,
      }));

      console.log('these are tasks:')
      console.log(tasks);

      // Send successful response back with data
      res.status(200).json(tasks);
    })}catch (error) {
    console.error('Error accessing Airtable:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
