## Libraries & Technologies

### Backend

**Express**
Used to build the REST API endpoints for file uploads, job management, health checks, and downloading processed results.

**Multer**
Handles multipart/form-data file uploads and stores uploaded CSV files on the server.

**ws**
Used for WebSocket-based communication between the server and clients, allowing job status and processing progress updates to be sent in real time.

**CORS**
Allows the frontend application to communicate with the backend API when they are running on different origins.

### Frontend

**React**
Used to build the user interface and manage application state such as uploaded files, queue status, processing progress, and job results.

**Vite**
Used as the frontend development and build tool for a fast development experience.

### Development

**Nodemon**
Automatically restarts the Node.js server during development whenever source files change.
