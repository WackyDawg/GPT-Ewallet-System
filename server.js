import { APP_CONFIG } from './config/config.js';
import app from './app.js';

const server = createServer(app);

server.listen(APP_CONFIG.PORT, () => {
  console.log(`Server is running on port ${APP_CONFIG.PORT}`);
});
