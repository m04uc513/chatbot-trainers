import { initBotUI, putMessage } from '/chatbot.js';

var app = new Vue({
  el: '#app',
  data: {
    header: "BookBot2 alpha version",
    footer: "2022/01/13",
    trainer: localStorage.getItem('trainer'),
    story: Grimm021,
    rules: '',
    mode: 0,
    current: -1,
    answer: '',
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
      //uttr.lang = "ja-JP";
      //uttr.name = "Kyoko";
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
          //console.log("# speekCancel: "+i);
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
    humanMessage: function(msg) {
      var obj = {
        human: true,
        content: msg
      }
      return(putMessage(obj));
    },
    showTop: async function() {
      console.log("# showTop");
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
      this.mode = 1;  // Footer Mode === 1

      // キャッシュされている読み上げテキストの消去
      this.speeking = false;
      await this.speekCancel();

      // 次の段落へ
      this.current++;
      if (this.current < this.story.length) {
        // 段落の表示・読み上げ
        var i = this.current;
        console.log("# "+i+"  "+this.story[i].subtitle);
        console.log("# showParagraph");
        await this.botMessage(this.story[i].paragraph);
        await this.speekParagraph();
      } else {        
        console.log("# End of Story");
        const msgs = [
          '物語は終わりです',
          'もう一度最初から繰り返したいときは「次へ」「続ける」と押してください。'
        ];
        for (var i = 0; i < msgs.length; i++) {
          await this.botMessage(msgs[i]);
          await this.speekSentence(msgs[i]);  
        }
        this.current = 0;
      }
    },
    showQuestion: async function() {
      this.mode = 2;  // Footer Mode === 2

      // キャッシュされている読み上げテキストの消去
      this.speeking = false;
      await this.speekCancel();

      console.log("# showQuestion");
      this.$refs.ANS.focus();
      var i = this.current;
      var rules = this.rules;
      if (rules[i].msg && rules[i].msg.length > 0) {
        //this.$refs.ANS.blur();
        await this.botMessage(rules[i].msg);
        await this.speekSentence(rules[i].msg);
      } else {
        //this.$refs.ANS.blur();
        this.showNoQuestion();
      }
    },
    showNoQuestion: async function() {
      this.mode = 0;  // Footer Mode === 0
      console.log("# showNoQuestion");
    },
    showAnswer: async function() {
      this.mode = 0;  // Footer Mode === 0
      console.log("# showAnswer");
      if (this.answer.length > 0) {
        console.log("anser: "+this.answer);
        await this.humanMessage(this.answer);
        await this.speekSentence(this.answer);

        // ルールによる応答文の選択
        var rules = this.rules;
        var i = this.current;
        var answer = this.answer;
        var reply = '';
        if (rules[i].qap[0].q.length > 0) {
          if (answer.indexOf(rules[i].qap[0].q) >= 0) {
           reply = rules[i].qap[0].a;
          } else if (rules[i].qap[1].q.length > 0) {
            if (answer.indexOf(rules[i].qap[1].q) >= 0) {
              reply = rules[i].qap[1].a;
            } else if (rules[i].qap[2].q.length > 0) {
              if (answer.indexOf(rules[i].qap[2].q) >= 0) {
                reply = rules[i].qap[2].a;
              }
            }
          }
        }
        if (reply == '') {
          reply = rules[i].nca;
        }
        console.log("reply: "+reply);
        if (reply != '') {
          await this.botMessage(reply);
          await this.speekSentence(reply);
        }
        this.answer = '';
      }
    }
  }
});
