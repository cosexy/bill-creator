module.exports = {
  apps: [
    {
      name: 'bill-credit',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run preview'
    }
  ]
}
