const Message = require('../models/Message');
const mapMessage = require('../mappers/message');


module.exports.messageList = async function messages(ctx, next) {
  try {
    const messages = await Message.find({chat: ctx.user._id}) || [];
    if (messages) {
      ctx.status = 200;
      ctx.body = {messages: messages.map(mapMessage)};
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
