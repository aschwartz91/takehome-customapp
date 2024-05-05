import Airtable from 'airtable';

// This handler updates a task's status
export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id, fields } = req.body;

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  try {
    const updatedRecord = await base(process.env.AIRTABLE_TABLE_NAME).update(id, fields);
    console.log('Updated', updatedRecord.id);

    res.status(200).json({ message: 'Task updated successfully', id: updatedRecord.id, fields: updatedRecord.fields });
  } catch (error) {
    console.error('Error updating record in Airtable:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}
