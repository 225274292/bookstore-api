const express = require('express');
const app = express();
app.use(express.json());

let books = [{ id: 1, title: 'Clean Code', author: 'Robert C. Martin' }];

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
app.get('/books', (_req, res) => res.json(books));
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'title and author required' });
  const id = books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
  const book = { id, title, author };
  books.push(book);
  res.status(201).json(book);
});
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  books[idx] = { id, ...req.body };
  res.json(books[idx]);
});
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = books.length;
  books = books.filter(b => b.id !== id);
  if (books.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Bookstore API listening on ${port}`));
}
