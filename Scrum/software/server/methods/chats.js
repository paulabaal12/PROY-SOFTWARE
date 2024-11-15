Meteor.methods({
  'chats.findOrCreate'(productId, participants) {
    check(productId, String);
    check(participants, [String]);

    let chat = Chats.findOne({ productId, participants: { $all: participants } });
    if (!chat) {
      const chatId = Chats.insert({
        productId,
        participants,
        createdAt: new Date()
      });
      return chatId;
    }
    return chat._id;
  }
});

