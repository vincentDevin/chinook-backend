import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const html = `
    <html>
      <head>
        <title>API Routes Documentation</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; border: 1px solid #ddd; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>API Routes Documentation</h1>
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Method</th>
              <th>Permissions</th>
              <th>Data Types</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/api/tracks</td>
              <td>GET</td>
              <td>Public (no authentication required)</td>
              <td>None</td>
            </tr>
            <tr>
              <td>/api/tracks/:id</td>
              <td>GET</td>
              <td>Authenticated</td>
              <td>ID (number)</td>
            </tr>
            <tr>
              <td>/api/tracks</td>
              <td>POST</td>
              <td>Admin (roleId >= 2)</td>
              <td>Track data (JSON)</td>
            </tr>
            <tr>
              <td>/api/tracks/:id</td>
              <td>PUT</td>
              <td>Admin (roleId >= 2)</td>
              <td>Track data (JSON)</td>
            </tr>
            <tr>
              <td>/api/tracks/:id</td>
              <td>DELETE</td>
              <td>Admin (roleId >= 2)</td>
              <td>ID (number)</td>
            </tr>
            <!-- Add more routes here as needed -->
          </tbody>
        </table>
      </body>
    </html>
  `;

  res.send(html);
});

export default router;
