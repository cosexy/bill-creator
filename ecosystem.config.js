module.exports = {
  apps: [
    {
      name: 'https://billcredit.buzz/',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run preview'
    }
  ]
}
