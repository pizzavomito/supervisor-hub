const DiscordNotifier = require('./notifiers/discord')
const SlackNotifier = require('./notifiers/slack')
module.exports = class NotifierFactory {
  static create(config) {
    switch(config.type) {
      case 'discord':
        return new DiscordNotifier({...config})
      case 'slack':
        return new SlackNotifier({...config})
      default:
        return new Error('Notifier type not supported')
    }
  }
}
