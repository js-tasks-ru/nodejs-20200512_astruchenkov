module.exports = function mapMessage(message) {
  return {
    id: message._id,
    text: message.text,
    user: message.user,
    date: new Date(message.date).toISOString(),
  };
};
