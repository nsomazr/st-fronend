const path = require('path');

const port = process.env.PORT || 3094;

module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'st-frontend',
      script: path.join(__dirname, 'node_modules/.bin/serve'),
      args: `-s dist -l ${port}`,
      cwd: __dirname,
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
