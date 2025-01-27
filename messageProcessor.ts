class MessageProcessor {
  static processUserMessage(text) {
    return window.processMessage(text);
  }
}

window.MessageProcessor = MessageProcessor;
