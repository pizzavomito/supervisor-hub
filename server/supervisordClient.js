const supervisord = require('supervisord');

module.exports = (supervisor) => {
  return supervisord.connect({
    hostname: supervisor.host,
    port: supervisor.port,
    user: supervisor.username,
    pass: supervisor.password
  })
}
