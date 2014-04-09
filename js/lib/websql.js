var websql = (function () {
  var db;

  var createDatabase = function () {
    db = openDatabase('websqlDatabase', '1.0', 'my first database', 2 * 1024 * 1024);
  };

  var run = function (query, fn) {
    db.transaction(function (tx) {
      var successHandler = function (tx, results) {
        if (typeof fn == 'undefined')
          return;

        var len = results.rows.length, i;
        for (i = 0; i < len; i++) {
          fn( results.rows.item(i), results.rows.length, i);
        }
      };

      var errorHandler = function (transaction, error) {
        console.error('WebSQL Error: ' + error.message + ' in "' + query + '".');
      };

      tx.executeSql(query, [], successHandler, errorHandler);
    });
  };

  var deleteTable = function (table) {
    run('DROP TABLE ' + table);
  };

  return {
    createDatabase: createDatabase,
    run: run,
    deleteTable: deleteTable
  };
}());