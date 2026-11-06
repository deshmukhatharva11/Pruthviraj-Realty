module.exports = {
  apps: [
    {
      name: "pruthviraj-realty",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
    },
  ],
};

