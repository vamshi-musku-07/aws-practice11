module.exports = {
  apps: [
    {
      name: "aws-practice",
      cwd: "./backend",
      script: "server.js",
      instances: 1,
      autorestart: true,
      max_restarts: 20,
      min_uptime: "5s",
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "aws-practice-frontend",
      cwd: "./frontend",
      script: "node_modules/vite/bin/vite.js",
      args: "--host 0.0.0.0 --port 5173",
      instances: 1,
      autorestart: true,
      max_restarts: 20,
      min_uptime: "5s",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
