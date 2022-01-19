import { initBotUI, putMessage } from '/chatbot.js';

var app = new Vue({
  el: '#app',
  data: {
    header: "BookBot2 alpha version",
    footer: "2022/01/13",
    trainer: localStorage.getItem('trainer'),
    story: Grimm021,
    rules: '',
    current: -1,
    synth: null
  },
  async mounted() {
    this.synth = window.speechSynthesis;

    var args = { key: localStorage.getItem('trainer') };
    var res = await this.getScript(args);
    //console.log(JSON.stringify(res, null, 2));
    if (res.message != 'success') {
      this.rules = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, 
                     {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];
    }
    localStorage.setItem('rules', res.response);
    this.rules = JSON.parse(res.response);
    this.current = 0;

    console.log("this.rules[0].title: "+this.rules[0].title);
    this.header = "Trainer: "+this.trainer;
    this.footer = "Rules: "+this.rules.length+" items";

    initBotUI();

    this.current = 0;
    this.readParagraph();
  },
  methods: {
    getScript: async function(data) {
      const res = await fetch("/get", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await res.json();
      return(response);
    },
    speakSentence: function (sentence) {
      var synth = this.synth;
      var uttr = new SpeechSynthesisUtterance();
      uttr.lang = "ja-JP";
      uttr.name = "Kyoko";
      //uttr.pitch = 0.7;
      //uttr.rate = 0.8;
      uttr.rate = 0.8;
      uttr.pitch = 1.2;
      uttr.text = sentence;
      return(new Promise(function(resolve){
        uttr.onend = resolve;
        synth.speak(uttr);
      }));
    },
    readingTop: async function() {
      // タイトルコール
      //await botui.message.bot(Grimm021[0].title);
      await putMessage(this.story[0].title);
      console.log("Bot: "+this.story[0].title);
      await this.speakSentence(this.story[0].title);
      this.current++;
    },
    readParagraph: async function() {
      if (this.current == 0) {
        // タイトルコール
        //await botui.message.bot(Grimm021[0].title);
        await putMessage(this.story[0].title);
        console.log("Bot: "+this.story[0].title);
        await this.speakSentence(this.story[0].title);
        this.current++;
      } else {
        // 段落
        //await botui.message.bot(Grimm021[i].paragraph);
        var i = this.current;
        console.log("Bot: "+this.story[i].paragraph);
        await putMessage(this.story[i].paragraph);
        for (var j = 0; j < this.story[i].recite.length; j++) {
          await this.speakSentence(this.story[i].recite[j]);
        }
        this.current++;
        if (this.current >= this.story.length) {
          this.current = 0;
        }
      }
    }
  }
});
