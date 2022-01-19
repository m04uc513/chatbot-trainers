var botui;

function initBotUI() {
  botui = new BotUI('AAA');
}

function putMessage(arg) {
  botui.message.add(arg);
}

export { initBotUI, putMessage };