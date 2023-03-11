module.exports = {
  apps: [
    {
      name: 'http://billcredit.buzz/',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'run preview'
    }
  ]
}
