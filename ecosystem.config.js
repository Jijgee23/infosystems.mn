// PM2: pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: "infosystems-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1, // rate limiting is in-memory; keep a single process
      max_memory_restart: "1G",
      env_production: {
        NODE_ENV: "production",
        TZ: "Asia/Ulaanbaatar",
      },
    },
  ],
};
