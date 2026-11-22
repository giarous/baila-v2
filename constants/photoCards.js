const photoCards = [
  {
    name: 'Barman',
    photo: require('../assets/barman.png'),
    description:
      "The person drawing the card will share three sips from someone's drink or drinks between a co-player or co-players.",
    state: true,
  },
  {
    name: 'Buddy',
    photo: require('../assets/buddy.png'),
    description:
      'The player with the least amount of a drink left shall ask the player who has drawn the Buddy-card a question about himself/herself. If the answer given by the person who drew the Buddy-card is incorrect. he/she must take a sip from his/her drink. If the answer is correct, then the person who asked the question must take a sip from his/her drirk.',
    state: true,
  },
  {
    name: 'Category',
    photo: require('../assets/category.png'),
    description:
      'Pick a category, for example: music genres, beer brands. The next player has to say one item and each following player does the same until someone cannot come up with anything else. That person has to take a sip of his/her drink.',
    state: true,
  },
  {
    name: 'Celebrity',
    photo: require('../assets/celebrity.png'),
    description:
      'The person who draws the card will name a category and a letter with which the name and surname or artist name of a celebrity must begin. The player following the person who draws the card will start with naming. The one who fails to name a celebrity must take a sip of their drink.',
    state: true,
  },
  {
    name: 'Word-Chain',
    photo: require('../assets/chain.png'),
    description:
      'Say a word and the next player has to repeat your word and add another one. The following player repeats all the words in the same order and adds one more word. It continues until someone makes a mistake. That person has to take a sip of his/her drink.',
    state: true,
  },
  {
    name: 'Chin King',
    photo: require('../assets/chin_king.png'),
    description:
      'The Chin King has the right to hold his/her chin, at any time. Then other players have to hold their chin as well. The last person has to drink. The Chin King title passes on to the next player, who gets the next Chin King card.',
    state: true,
  },
  {
    name: 'Choose who drinks',
    photo: require('../assets/choose_who_drinks.png'),
    description: 'You can choose, who has to take a sip from his/her drink.',
    state: true,
  },
  {
    name: 'Cocktail',
    photo: require('../assets/cocktail.png'),
    description:
      'The person drawing the card starts. All players take turns to pour their drinks to the empty glass on the table. No assisting items can be used for pouring. The drink can be poured only from one’s cup. The person who makes the cocktail overflow from the glass must drink the cocktail.',
    state: true,
  },
  {
    name: 'Confiscate',
    photo: require('../assets/confiscate.png'),
    description:
      'You can confiscate a sip of a friend’s drink, a clothing item or whatever you desire, including The Chin King or Question Master title. Your request can be rejected by taking a sip of a drink.',
    state: true,
  },
  {
    name: 'Do This!',
    photo: require('../assets/do_it.png'),
    description:
      'The first three persons who draw the "Do This!" card will show what the forth player must do. Be ready! The fourth person to draw the "Do This!" card will give you the show worth recording!',
    state: true,
  },
  {
    name: 'Skip',
    photo: require('../assets/dont_drink.png'),
    description:
      'The player who picks this card misses a turn and the next player takes a card.',
    state: true,
  },
  {
    name: 'Women Drink',
    photo: require('../assets/girls_drink.png'),
    description: 'All females take a sip of their drinks.',
    state: true,
  },
  {
    name: 'Men Drink',
    photo: require('../assets/guys_drink.png'),
    description: 'All males take a sip of their drinks.',
    state: true,
  },
  {
    name: 'I have never...',
    photo: require('../assets/i_have_never.png'),
    description:
      'The person drawing the card will make one statement that he or she has never done/seen etc. The co-player/players who have done/seen etc. it must take a sip of their drinks as punishment.',
    state: true,
  },
  {
    name: 'Joker',
    photo: require('../assets/joker.png'),
    description:
      'The one who has drawn the Joker may double the punishment or the task of someone else. For example, if another player has to make the Yoga-task until his/her turn, the Joker will double it until the next round; if another player has to take a sip from his/her drink as a punishment, the Joker will double the punishment to two sips, etc. The Joker will become invalid as  soon as a new Joker owner appears.',
    state: true,
  },
  {
    name: 'Pour into the cup',
    photo: require('../assets/pour_into_the_cup.png'),
    description:
      'Pour a drop of your drink into the glass in the middle of the circle. The person, who picks the fourth “pour into the cup” card has to drink the whole cup.',
    state: true,
  },
  {
    name: 'Question Master',
    photo: require('../assets/question_king.png'),
    description:
      'Question Master is a person whose questions must not be answered. If someone answers his/her questions, they have to drink. In case the person remembers not to answer and says: "You are the Question Master" instead, then the Question Master has to drink. The title passes on to the next player, who gets the Question Master card.',
    state: true,
  },
  {
    name: 'Rhyme',
    photo: require('../assets/rhyme.png'),
    description:
      'Make up a sentence; the person next to you has to make a sentence that rhymes with the previous one. The player who cannot come up with a rhyme in at least ten seconds has to drink. The rhymes are not allowed to repeat.',
    state: true,
  },
  {
    name: 'Rule',
    photo: require('../assets/rule.png'),
    description:
      'Come up with a rule how everybody has to drink. Think of a rule which does not include a lot of movement. For example saying a word or sentence before drinking or doing a gesture, like holding one arm on the table while drinking. The rules are valid until the end of the game and during “The Waterfall”.',
    state: true,
  },
  {
    name: 'Seven',
    photo: require('../assets/seven.png'),
    description:
      'The players will count numbers in ascending order, starting from one. If the number has a 7 in it or if the number can be divided by 7, the player must say “Baila” instead of the number and the direction of counting will change. The person who makes a mistake must take a sip of his or her drink as punishment.',
    state: true,
  },
  {
    name: "Let's Share!",
    photo: require('../assets/share.png'),
    description:
      'Everyone will give one sip of their drink to co-player on their left.',
    state: true,
  },
  {
    name: 'Taboo',
    photo: require('../assets/taboo.png'),
    description:
      'The person drawing the card will think of something that cannot be done until the end or the game. During the game there will be in total 4 taboos that must be simultaneously followed until the end of the game. The person violating the taboo must take a sip from his or her own glass as punishment.',
    state: true,
  },
  {
    name: 'Change of direction',
    photo: require('../assets/u_turn.png'),
    description:
      'The direction of drawing the cards will change - if cards were drawn in clockwise direction, then now the direction will change to counter clockwise and vice versa.',
    state: true,
  },
  {
    name: 'VIP',
    photo: require('../assets/vip.png'),
    description:
      'The person drawing the card may use the card once for the purposes of immunity. For example he or she may refuse to take a punishment sip or performing a task. The card will become invalid if immunity is used or if a new VIP card is drawn.',
    state: true,
  },
  {
    name: 'Waterfall',
    photo: require('../assets/waterfall.png'),
    description:
      'Decide in which direction the waterfall flows. Everybody starts drinking at the same time. After the person who got the card stops drinking, the next player can stop as well and so on. Everyone else has to drink until it is their turn to stop. Before everybody starts, the players should refill their glasses.',
    state: true,
  },
  {
    name: 'Yes-Man',
    photo: require('../assets/yes_man.png'),
    description:
      'The person drawing the card must answer “Yes"! to absolutely all questions aimed at him or her. If he or she answers differently, the Yes-man must take sip from his or her drink as punishment. The title will be transferred to a person who draws a new "Yes-Man" card.',
    state: true,
  },
  {
    name: 'Yoga',
    photo: require('../assets/yoga.png'),
    description:
      'The person drawing the card will appoint a co-player and will show a position that a player must hold until the next turn of the person holding the pose!',
    state: true,
  },
  {
    name: 'Drink',
    photo: require('../assets/you_drink.png'),
    description: 'Take a sip of your drink.',
    state: true,
  },
];
export default photoCards;
