const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const clientDistPath = path.resolve(__dirname, '../client/dist');

app.use(express.json());
app.use('/api', (_req, res) => {
  res.json({ status: 'ok', message: 'API is ready for future endpoints.' });
});

const indexPath = path.join(clientDistPath, 'index.html');
const hasClientBuild = fs.existsSync(indexPath);

if (hasClientBuild) {
  app.use(express.static(clientDistPath));
}

app.get('*', (_req, res) => {
  if (!hasClientBuild) {
    return res.status(503).send(`
      <html>
        <head><title>Client Build Missing</title></head>
        <body style="font-family: sans-serif; padding: 1.5rem;">
          <h1>Client build not found</h1>
          <p>Run <code>npm run build</code> and restart the server.</p>
        </body>
      </html>
    `);
  }

  return res.sendFile(indexPath);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the existing process or run with PORT=<new_port>.`);
    process.exit(1);
  }

  throw error;
});
