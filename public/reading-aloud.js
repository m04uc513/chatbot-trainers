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
    speeking: false,
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

    this.header = "Trainer: "+this.trainer;
    this.footer = "Rules: "+this.rules.length+" items";

    initBotUI();

    this.showTop();
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
    speekSentence: function (sentence) {
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
    speekCancel: function () {
      var synth = this.synth;
      return(new Promise(function(resolve){
        for(var i = 0; synth.pending || synth.speaking; i++) {
          synth.cancel();
          console.log("# speekCancel: "+i);
        }
        resolve(0);
      }));
    },
    botMessage: function(msg) {
      var obj = {
        content: msg
      };
      return(putMessage(obj));
    },
    showTop: async function() {
      this.current = 0;
      // タイトルコール  
      await this.botMessage(this.story[0].title);
      await this.speekSentence(this.story[0].title);
    },
    speekParagraph: async function() {
      var para = this.current;
      this.speeking = true;
      for (var i = 0; i < this.story[para].recite.length; i++) {
        if (!this.speeking) break;
        await this.speekSentence(this.story[para].recite[i]);
      }
      this.speeking = false;
      return new Promise((resolve, reject) => {
        resolve(i);
      });
    },
    stopParagraph: function() {
      this.speeking = false;
      this.speekCancel();
    },
    showParagraph: async function() {
      this.speeking = false;
      await this.speekCancel();

      this.current++;
      if (this.current >= this.story.length) {
        this.current = 1;
      }
      // 段落
      var i = this.current;
      console.log("# "+this.current+"  "+this.story[i].subtitle);
      await this.botMessage(this.story[i].paragraph);
      await this.speekParagraph();
    }
  }
});
