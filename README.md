# BookBot2: Chatbot & Trainer for Reading stories to children

<div style="text-align: right;">
2022/01/21<BR>
Akito Fujita
</div>

<BR><BR>

BookBot2 is a "voice chatbot for reading fairy tales" designed to be used as a teaching aid at Notre Dame University. BookBot2 is a voice chatbot for reading fairy tales to children. BookBot2 is a "voice chatbot for reading fairy tales to children" that supports the creation of dialogue rules and the reading of fairy tales based on those rules.


## Overview

The configuration as a web application is as follows.

  * Based on Glitch's hello-sqlite.
  * The backend is a Key/Value Store using SQLite3 to store the chatbot rule data.
  * The front-end consists of the following three pages
    - index.html: Home page. Enter the name of the rule's author and go to other pages.
    - public/edit-rule.html: Page to create rules for the chatbot
    - public/whole.html: A page to view the whole created rules.
    - public/reading-aloud.html: A page for reading aloud

In addition, this application is available at
[glitch](https://alive-fuchsia-runner.glitch.me/)


## About the application

This application is based on the This application is based on the assumption that AI chatbots will be widely used in society in the future. The purpose of this application is to provide students with a concrete understanding of the division of roles between AI and humans that is expected to occur in the future. The purpose of this application is to give students a concrete understanding of the division of roles between AI and humans that will occur in the future.

The aim of this project is to build a practical dialogue system using the current technology of generating response sentences by applying machine learning. In order to build a practical dialogue system In order to build a practical dialogue system using today's technology of generating response sentences using machine learning, a large dialogue corpus (question & answer sentences) is required.

In order to prepare an optimal dialogue corpus for a specific dialogue situation, we have to artificially create a dialogue record for that dialogue situation.

This application is
The application assumes the reading of the fairy tale "Cinderella".
By writing simple rules
By writing simple rules, the user can make arbitrary comments or ask questions during the story.
In the case of questions, it functions as a voice chatbot that further responds to the audience's responses.
In the case of questions, it can further respond to audience responses.

Through rule writing, students can
the practicality of the dialogue system.
Imagine a situation where a voice chatbot functions.
In order to improve the practicality of the dialogue system, students must prepare enough responses that
Students will learn that in order to improve the practicality of the dialogue system, they must imagine the situation in which the voice chatbot will function, and prepare enough responses to make it feel more human-like.

## Dialogue rules

This chatbot uses the ELIZA/ALICEbot method as a reference.
This chatbot generates responses by using simpler rules based on the ELIZA/ALICEbot method.
The following three types of messages are defined.

* Message (MSG): A message that is uttered immediately after reading out a paragraph of a fairy tale.
* Question-Answer Pair (QAP): A possible response and the message to be returned.
* Non Condition Answer (NCA): A message to be returned if the expected response is not met.

Only one MSG can be defined for each paragraph of a fairy tale.
If you just want to comment on a paragraph, there is no need to define QAP and NCA.

The QAP is the message that the audience would have responded to if the MSG had been a question to the audience.
The QAP defines the set of responses (Q) and responses (A) that are expected from the audience when the MSG is a question to the audience.
Up to three sets of QAP can be defined for one MSG.
As in ELIZA/ALICEbot, if Q is a word or a phrase, it is possible to define up to three sets of QAPs.
As in ELIZA/ALICEbot, if Qs are made into words or phrases, more responses can be returned.

NCA is a response that is returned when the response from the audience does not meet the definition of QAP.
If you get a response, but the chatbot doesn't respond.
If the chatbot does not respond to any of the responses
The audience will be disappointed.

There are probably three patterns of definitions

* Define MSG only: the chatbot will only comment on this paragraph.
* Define MSG/NCA: the chatbot will return the same message no matter what the response from the audience is.
* Define all: will it be possible to have ELIZA/ALICEbot-like reactions?

There are only a few rules that can be defined.
The reason why only a small number of rules can be defined is because we have practiced using this application in class.
This is not only to simplify the process of defining rules, but also
Even if you define only a few well-thought-out rules
I wanted to show that a chatbot can produce a reasonable reaction
I wanted to show that a chatbot can produce a reasonable reaction with just a few well-thought-out rules.


## About the fairy tale "Cinderella

The original text of the fairy tale "Cinderella" was taken from the following website.

[Grimm's Fairy Tales: A Japanese-English Comparison](https://www.grimmstories.com/language.php?grimm=021&l=ja&r=en)


## About the class

The class was held in November-December 2021 in three convenient sessions.
Students were unexpectedly active in participating.
Normally, in the practice of rule-based dialogue systems
Most of the students gave up on the task of creating the rules.
However, in this case, the students were able to create their own rules.
However, in this case, we set the constraint "for any paragraph of a fairy tale".
This time, however, I set the constraint "for any paragraph in a fairy tale," which should have narrowed down the topics to be included in the rules.
The students defined many rules as they wished.

It was a good decision to set the constraint of "reading fairy tales" in the dialogue system. I think it was a good decision to set the constraint of "reading fairy tales" in the dialogue system.


That's all.

Translated with www.DeepL.com/Translator (free version)
