import { Router, Request, Response } from 'express';

const router = Router();

// Documentation data structure for all routes
const routesInfo = {
  "User Routes": [
    { path: '/api/users', method: 'GET', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'None' },
    { path: '/api/users/:id', method: 'GET', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'ID (number)' },
    { path: '/api/users', method: 'POST', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'User data (JSON)' },
    { path: '/api/users/:id', method: 'PUT', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'User data (JSON)' },
    { path: '/api/users/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'ID (number)' },
  ],
  "User Role Routes": [
    { path: '/api/user-roles', method: 'GET', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'None' },
    { path: '/api/user-roles/:id', method: 'GET', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'ID (number)' },
    { path: '/api/user-roles', method: 'POST', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'User role data (JSON)' },
    { path: '/api/user-roles/:id', method: 'PUT', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'User role data (JSON)' },
    { path: '/api/user-roles/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 2)', dataTypes: 'ID (number)' },
  ],
  "Media Type Routes": [
    { path: '/api/media-types', method: 'GET', permissions: 'Public (no authentication required)', dataTypes: 'None' },
    { path: '/api/media-types/:id', method: 'GET', permissions: 'Authenticated', dataTypes: 'ID (number)' },
    { path: '/api/media-types', method: 'POST', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Media type data (JSON)' },
    { path: '/api/media-types/:id', method: 'PUT', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Media type data (JSON)' },
    { path: '/api/media-types/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'ID (number)' },
  ],
  "Genre Routes": [
    { path: '/api/genres', method: 'GET', permissions: 'Public (no authentication required)', dataTypes: 'None' },
    { path: '/api/genres/:id', method: 'GET', permissions: 'Authenticated',dataTypes: 'ID (number)' },
    { path: '/api/genres', method: 'POST', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Genre data (JSON)' },
    { path: '/api/genres/:id', method: 'PUT', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Genre data (JSON)' },
    { path: '/api/genres/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'ID (number)' },
  ],
  "Artist Routes": [
    { path: '/api/artists', method: 'GET', permissions: 'Public (no authentication required)', dataTypes: 'None' },
    { path: '/api/artists/:id', method: 'GET', permissions: 'Authenticated', dataTypes: 'ID (number)' },
    { path: '/api/artists', method: 'POST', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Artist data (JSON)' },
    { path: '/api/artists/:id', method: 'PUT', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Artist data (JSON)' },
    { path: '/api/artists/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'ID (number)' },
  ],
  "Album Routes": [
    { path: '/api/albums', method: 'GET', permissions: 'Public (no authentication required)',dataTypes: 'None' },
    { path: '/api/albums/:id', method: 'GET', permissions: 'Authenticated', dataTypes: 'ID (number)' },
    { path: '/api/albums', method: 'POST', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Album data (JSON)' },
    { path: '/api/albums/:id', method: 'PUT',permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'Album data (JSON)' },
    { path: '/api/albums/:id', method: 'DELETE', permissions: 'Authenticated Admin (roleId >= 3)', dataTypes: 'ID (number)' },
  ],
};

router.get('/', (req: Request, res: Response) => {
  const html = `
    <html>
      <head>
        <title>API Routes Documentation</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .collapsible { background-color: #f4f4f4; color: black; cursor: pointer; padding: 10px; width: 100%; border: none; text-align: left; outline: none; font-size: 18px; }
          .active, .collapsible:hover { background-color: #ccc; }
          .content { padding: 0 18px; display: none; overflow: hidden; background-color: #f9f9f9; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 10px; border: 1px solid #ddd; }
          th { background-color: #eee; }
        </style>
      </head>
      <body>
        <h1>API Routes Documentation</h1>

        ${Object.entries(routesInfo).map(([section, routes]) => `
          <button class="collapsible">${section}</button>
          <div class="content">
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
                ${routes.map(route => `
                  <tr>
                    <td>${route.path}</td>
                    <td>${route.method}</td>
                    <td>${route.permissions}</td>
                    <td>${route.dataTypes}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <script>
          var coll = document.getElementsByClassName("collapsible");
          for (var i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var content = this.nextElementSibling;
              if (content.style.display === "block") {
                content.style.display = "none";
              } else {
                content.style.display = "block";
              }
            });
          }
        </script>
      </body>
    </html>
  `;

  res.send(html);
});

export default router;