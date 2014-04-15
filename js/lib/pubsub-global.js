var pubsub = (function (){
  var list = [];

  var subscribe = function (evt, fn) {
    list.push({
      evt: evt,
      fn: fn
    });
  };

  var publish = function (evt, data) {
    list.forEach(function (subscriber) {
      if (subscriber.evt === evt) {
        console.warn('Pubsub Evt Fired: ' + evt);
        subscriber.fn(evt, data);
      }
    });
  };

  return {
    subscribe: subscribe,
    publish: publish
  };
}());