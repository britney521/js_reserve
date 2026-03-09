(function () {
  var g = function () {
    var p = true;
    return function (r, s) {
      var t = p ? function () {
        if (s) {
          var u = s["apply"](r, arguments);
          s = null;
          return u;
        }
      } : function () {};
      p = false;
      return t;
    };
  }();

  var h = g(this, function () {
    var p = function () {
      var q = p["constructor"]("return /\" + this + \"/")()["compile"]("^([^ ]+( +[^ ]+)+)+[^ ]}");
      return !q["test"](h);
    };

    return p();
  });
  h();

  var j = function () {
    var p = true;
    return function (r, s) {
      var v = p ? function () {
        if (s) {
          var w = s["apply"](r, arguments);
          s = null;
          return w;
        }
      } : function () {};
      p = false;
      return v;
    };
  }();

  (function () {
    j(this, function () {
      var p = new RegExp("function *\\( *\\)");
      var q = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
      var r = $c("init");

      if (!p["test"](r + "chain") || !q["test"](r + "input")) {
        r("0");
      } else {
        $c();
      }
    })();
  })();

  var k = function () {
    var p = true;
    return function (q, r) {
      var u = p ? function () {
        if (r) {
          var v = r["apply"](q, arguments);
          r = null;
          return v;
        }
      } : function () {};
      p = false;
      return u;
    };
  }();

  var l = k(this, function () {
    var p = function () {};

    var q = function () {
      var s;

      try {
        s = Function("return (function() {}.constructor(\"return this\")( ));")();
      } catch (t) {
        s = window;
      }

      return s;
    };

    var r = q();

    if (!r["console"]) {
      r["console"] = function (s) {
        var x = {};
        x["log"] = s;
        x["warn"] = s;
        x["debug"] = s;
        x["info"] = s;
        x["error"] = s;
        x["exception"] = s;
        x["table"] = s;
        x["trace"] = s;
        return x;
      }(p);
    } else {
      r["console"]["log"] = p;
      r["console"]["warn"] = p;
      r["console"]["debug"] = p;
      r["console"]["info"] = p;
      r["console"]["error"] = p;
      r["console"]["exception"] = p;
      r["console"]["table"] = p;
      r["console"]["trace"] = p;
    }
  });
  l();

  try {
    if (global) {
      decrypt("1746498326");
    }
  } catch (o) {
    global = new Array();
  }

  window = new Array();

  for (var m = 1; m <= 5; m++) {
    res = decrypt("1746498326") + "r";
  }

  document["cookie"] = "m=" + (m - 1)["toString"]() + res + "; path=/";
})();

setInterval(function () {
  $c();
}, 4000);

function $c(b) {
  function e(f) {
    if (typeof f === "string") {
      return function (i) {}["constructor"]("while (true) {}")["apply"]("counter");
    } else {
      if (("" + f / f)["length"] !== 1 || f % 20 === 0) {
        (function () {
          return true;
        })["constructor"]("debugger")["call"]("action");
      } else {
        (function () {
          return false;
        })["constructor"]("debugger")["apply"]("stateObject");
      }
    }

    e(++f);
  }

  try {
    if (b) {
      return e;
    } else {
      e(0);
    }
  } catch (h) {}
}