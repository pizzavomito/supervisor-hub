const { Webhook, MessageBuilder } = require('discord-webhook-node');

module.exports = class DiscordNotifier {
    hook
    supervisor
    constructor({webhook}) {
      if (webhook) {
        this.hook = new Webhook(webhook)
      }
    }

    notify(processes, type = 'error') {
      let name = 'Supervisor Hub'
      if(this.supervisor) {
        name = this.supervisor.name
      }
      let color = '#11ff00'
      if (type === 'error') {
        color = '#ff0026'
      }
      const embed = new MessageBuilder()
        .setTitle('My title here')
        .setAuthor(name)
        .setURL('http://'+this.supervisor.host+':'+this.supervisor.port)
        .setColor(color)
        // .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
        // .setDescription('Oh look a description :)')
        // .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
        // .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
        .setTimestamp()
      processes.forEach(process => {
        embed.addField(process.group + process.name, process.statename + ' ' + process.spawnerr, true)
      })

      this.hook.send(embed)

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
