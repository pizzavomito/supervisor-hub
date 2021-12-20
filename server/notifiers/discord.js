const wh = require("webhook-discord")
// https://discord.com/api/webhooks/917135250231013388/srSG52Cb1mVSYZlT_LmJ2quAqT_staftv2zHz7Rx2tecZ6BBznOmCh-LKTP_j79K9QBD
module.exports = class DiscordNotifier {
    hook
    supervisor
    constructor({webhook}) {
      if (webhook) {
        this.hook = new wh.Webhook(webhook)
      }
    }

    notifyError(msg) {
      // let name = 'Supervisor Hub'
      // if(this.supervisor) {
      //   name = this.supervisor.name
      // }
      // this.hook.err('Supervisor Hub', msg)
    }
}
