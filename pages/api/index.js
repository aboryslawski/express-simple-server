import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.get('https://hpjmztojsgsfbln7ibyhxzt2s.js.wpenginepoweredstaging.com/');
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error fetching home URL:', error.message);
    res.status(500).json({ error: 'Error fetching content from home URL' });
  }
}