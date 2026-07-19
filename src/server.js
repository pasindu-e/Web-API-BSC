const app           = require('./app');
const { connect }   = require('./config/db');
const { PORT }      = require('./config/env');
const logger        = require('./config/logger');

connect()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  });
