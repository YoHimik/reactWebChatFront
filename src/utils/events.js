let events = {};

module.exports.listenEvent = (eventName, handler) => {
  events[eventName] = handler;
};

module.exports.callEvent = (eventName, data) => {
  const event = events[eventName];
  if (!event) return;
  setTimeout(() => event(data), 0);
};
