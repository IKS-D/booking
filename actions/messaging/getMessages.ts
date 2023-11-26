export async function getMessages() {
  const messages = mockMessages;

  return messages;
}

const mockMessages = [
    { id: 1, sender: "user", content: "Hi, I'm interested in the listing!", timestamp: "09:30 AM" },
    { id: 2, sender: "owner", content: "Great to hear! When would you like to visit?", timestamp: "09:32 AM" },
    { id: 3, sender: "user", content: "How about tomorrow at 3pm?", timestamp: "09:34 AM" },
    { id: 4, sender: "owner", content: "Sounds good! See you then.", timestamp: "09:36 AM" }
  ];

