export async function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: 'Welcome to icecode.dev API!' });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}