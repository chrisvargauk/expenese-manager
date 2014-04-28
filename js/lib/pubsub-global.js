console.log('loaded: js/lib/pubsub-global.js');

define(function () {
  var pubsub = (function (){
    var list = [];

    var subscribe = function (evt, fn) {
      list.push({
        evt: evt,
        fn: fn
      });
    };

    var publish = function (evt, data) {
      console.warn('Pubsub Evt Fired: ' + evt);

      list.forEach(function (subscriber) {
        if (subscriber.evt === evt) {
          subscriber.fn(evt, data);
        }
      });
    };

    return {
      subscribe: subscribe,
      publish: publish
    };
  }());

  // TODO: resolve this
  window.pubsub = pubsub;
  return pubsub;
});