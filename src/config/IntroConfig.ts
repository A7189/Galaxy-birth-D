export const INTRO_CONFIG = {
    name: "ica",
    photo: "/ica_1.jpg",
    colors: {
        primary: "#ff66b2",
        accent: "#60a5fa",
        background: "#0b001a",
        text: "#ffffff",
   },
    sections: [
        { type: "greeting", title: "Hi", subtitle: "I really like your name btw!" },
        { type: "countdown", from: 3, goText: "🎉" },
        { type: "announcement", text: "It's your birthday!! :D" },
        { type: "chatbox", message: "Happy birthday to youu!! Wishing you a wonderful year ahead filled with joy, love, and endless happiness!", buttonText: "Send" },
        { type: "ideas", lines: ["That's what I was going to do.", "But then I stopped.", "I realised, I wanted to do something <strong>special</strong>.", "Because,", "You are Special :)"], bigLetters: "SO" },
        { type: "quote", text: "The more you praise and celebrate your life, the more there is in life to celebrate.", author: "Oprah Winfrey" },
        { type: "stars", count: 40 },
        { type: "balloons", count: 25 },
        { type: "profile", wishTitle: "Happy Birthday!", wishText: "Semoga suka ya sama apa yang aku buat ini ;)" },
        { type: "fireworks", count: 24 },
        { type: "closing", text: "Are you ready to see your universe?" }
    ]
};