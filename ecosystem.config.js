module.exports = {
  apps: [
    {
      name: "pks-pengumuman",
      script: "npm",
      args: "start",
      cwd: "/var/www/pks",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
