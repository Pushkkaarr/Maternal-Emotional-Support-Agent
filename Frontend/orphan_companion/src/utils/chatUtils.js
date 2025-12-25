export const modelResponses = {
    mom: [
      "I'm so proud of everything you're accomplishing. Tell me more about your day.",
      "You know you can always talk to me about anything that's on your mind, dear.",
      "Remember to take care of yourself. Have you been eating well and getting enough rest?",
      "I believe in you completely. You have so many wonderful qualities.",
      "It's okay to feel that way. Your emotions are valid and important."
    ],
    dad: [
      "That's interesting. What do you think is the next step forward?",
      "You've got this. I've seen how capable you are when you set your mind to something.",
      "Let's think through this together. There's always a solution.",
      "I'm here if you need any practical advice or just someone to listen.",
      "Sometimes the challenging moments teach us the most important lessons."
    ],
    sibling: [
      "I totally get what you mean. I've been in similar situations.",
      "Want to hear something funny that happened to me the other day?",
      "You know what might help? Taking a break and doing something fun for a while.",
      "I'm always here for you, no matter what. That's what siblings are for.",
      "Have you tried looking at it from this perspective? Just a thought."
    ],
    grandparent: [
      "In my experience, these things have a way of working themselves out with time.",
      "Would you like to hear a story from when I was your age?",
      "You remind me so much of your mother/father when they were younger.",
      "Life is full of beautiful moments. Remember to pause and appreciate them.",
      "Your generation has so many opportunities. I'm excited to see what you'll accomplish."
    ]
  };
  
  export const voiceConfigs = {
    // mom: {
    //   name: 'Indian Female voice',
    //   rate: 0.1,
    //   pitch: 1.1,
    //   accent: 'Indian'
    // },
    mom: { pitch: 1, rate: 1.1, volume: 1, name: "Young Indian Female" },
    // dad: {
    //   name: 'Indian Male voice',
    //   rate: 0.85,
    //   pitch: 0.9,
    //   accent: 'Indian'
    // },
    dad: { pitch: 0.1, rate: 1.6, volume: 1, name: "Young Indian Dad" },
    // sibling: {
    //   name: 'Young Indian voice',
    //   rate: 1.0,
    //   pitch: 1.05,
    //   accent: 'Indian'
    // },
    sibling:{ pitch: 0.5, rate: 1.6, volume: 1, name: "Young Indian Male" },
    // grandparent: {
    //   name: 'Elder Indian voice',
    //   rate: 0.8,
    //   pitch: 1.0,
    //   accent: 'Indian'
    // }
    grandparent: { pitch: 1, rate: 1.1, volume: 1, name: "Young Indian Female" }
  };
  
  export const welcomeMessages = {
    mom: "Hi beta! How are you doing today? I'm here if you want to talk about anything.",
    dad: "Hello beta! How's everything going? I'm here if you need any advice or just want to chat.",
    sibling: "What's up? Got anything cool going on? I'm all ears!",
    grandparent: "Namaste, my dear! It's so wonderful to talk with you. How have you been?"
  };
  
  export const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Today
    if (diff < 24 * 60 * 60 * 1000) {
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    
    // Yesterday
    if (diff < 48 * 60 * 60 * 1000) {
      return 'Yesterday';
    }
    
    // Less than a week ago
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    }
    
    // Older
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
  };
  