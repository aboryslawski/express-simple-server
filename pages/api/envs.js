export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('hello!!');
  console.log(process.env);
  res.status(200).json({ message: 'Envs displayed in logs!' });
}