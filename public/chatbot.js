var botui;

function initBotUI() {
  botui = new BotUI('AAA');
}

function putMessage(arg) {
  return(botui.message.add(arg));
}

export { initBotUI, putMessage };