module.exports = {
  apps : [{
    name: "wellness-app",
    script: "./src/app.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}