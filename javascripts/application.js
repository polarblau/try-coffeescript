(function() {
  var __slice = [].slice;

  $(function() {
    var $output, $source, THEME, consoleLog, evalOutput, hideErrors, log, output, showEvalError, showSourceError, source;

    THEME = 'monokai';
    $source = $('#source');
    source = {
      $editor: $source.find('.editor'),
      $errors: $source.find('.errors')
    };
    $output = $('#output');
    output = {
      $editor: $output.find('.editor'),
      $errors: $output.find('.errors'),
      $execute: $output.find('button.run'),
      $console: $output.find('.console')
    };
    log = function() {
      var $out, arg, args, content, lines;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      lines = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          content = (function() {
            switch (typeof arg) {
              case "object":
              case "array":
                return JSON.stringify(arg, void 0, 2);
              case "string":
                return "\"" + arg + "\"";
              case "function":
                return arg.toString();
              default:
                return arg;
            }
          })();
          _results.push("<pre class='line-item'>" + content + "<\/pre>");
        }
        return _results;
      })();
      $out = $("<div/>", {
        "class": "line",
        html: lines.join("")
      });
      return output.$console.append($out).stop().animate({
        scrollTop: output.$console.get(0).scrollHeight
      });
    };
    consoleLog = window.console.log;
    window.console.log = function() {
      log.apply(this, arguments);
      return consoleLog.apply(this, arguments);
    };
    showSourceError = function(line, message) {
      return source.$errors.show().text("[Line " + line + "] " + message);
    };
    showEvalError = function(line, message, url) {
      return output.$errors.show().text("[Line " + line + "] " + message);
    };
    hideErrors = function() {
      source.$errors.hide();
      return output.$errors.hide();
    };
    evalOutput = function() {
      var e, lineInfo;

      try {
        return eval(output.editor.getValue());
      } catch (_error) {
        e = _error;
        lineInfo = e.stack.match(/\<anonymous\>\:(\d+):\d+/);
        return showEvalError(lineInfo != null ? lineInfo[1] : void 0, e.message);
      }
    };
    source.editor = ace.edit(source.$editor.get('0'));
    output.editor = ace.edit(output.$editor.get('0'));
    source.editor.setTheme("ace/theme/" + THEME);
    source.editor.getSession().setMode('ace/mode/coffee');
    source.editor.getSession().setUseWrapMode(true);
    source.editor.setShowPrintMargin(false);
    source.editor.getSession().setTabSize(2);
    output.editor.setTheme("ace/theme/" + THEME);
    output.editor.getSession().setMode('ace/mode/javascript');
    output.editor.setReadOnly(true);
    output.editor.setShowPrintMargin(false);
    output.editor.getSession().setUseWrapMode(true);
    source.editor.getSession().on("change", function() {
      var compiledValue, e, sourceValue;

      sourceValue = source.editor.getValue();
      hideErrors();
      try {
        compiledValue = CoffeeScript.compile(sourceValue, {
          bare: true
        });
        return output.editor.setValue(compiledValue);
      } catch (_error) {
        e = _error;
        return showSourceError(e.location.first_line + 1, e.message);
      }
    });
    output.$execute.on('click', evalOutput);
    $('header .fullscreen').on('click', function() {
      return $(document).toggleFullScreen();
    });
    return $(document).on('keydown', function(e) {
      if (e.which === 13 && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        return evalOutput();
      } else if (e.which === 70 && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        return $(document).toggleFullScreen();
      }
    });
  });

}).call(this);
