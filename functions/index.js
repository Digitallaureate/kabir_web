const functions = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');

exports.server = onRequest(async (request, response) => {
  try {
    const { handler } = await import('./dist/server/entry.mjs');
    handler(request, response);
  } catch (error) {
    console.error("Error importing or running handler:", error);
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Internal Server Error');
  }
});