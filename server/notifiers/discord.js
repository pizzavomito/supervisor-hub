const { Webhook } = require('discord-webhook-node');

module.exports = class DiscordNotifier {
    hook
    supervisor
    constructor({webhook}) {
      if (webhook) {
        this.hook = new Webhook(webhook);
      }
    }

    notifyError(msg) {
      let name = 'Supervisor Hub'
      if(this.supervisor) {
        name = this.supervisor.name
      }
      console.log('Discord send error', name, msg);
      this.hook.setUsername('Supervisor Hub')
      this.hook.error('**Alarm**',name, msg)
    }
}
