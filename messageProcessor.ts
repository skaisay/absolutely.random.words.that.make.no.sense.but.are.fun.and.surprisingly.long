class MessageProcessor {
  static processMessage(text: string): string {
    return window.processMessage(text);
  }
}

window.MessageProcessor = MessageProcessor;
