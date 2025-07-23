const app = require('./src/app');
const { connectToDatabase } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to database then start server
connectToDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});