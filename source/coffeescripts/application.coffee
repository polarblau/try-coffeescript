$ ->

  THEME = 'monokai'

  $source = $('#source')
  source  =
    $editor : $source.find('.editor')
    $errors : $source.find('.errors')

  $output = $('#output')
  output  =
    $editor : $output.find('.editor')
    $errors : $output.find('.errors')
    $execute: $output.find('button.run')
    $console: $output.find('.console')

  # helpers
  log = (args...)->
    lines = for arg in args
      content = switch typeof arg
        # pretty print objects and arrays
        when "object", "array" then JSON.stringify(arg, undefined, 2)
        # wrap strings in quotes
        when "string"          then "\"#{arg}\""
        # show function body
        when "function"        then arg.toString()
        # otherwise just show
        else arg
      "<pre class='line-item'>#{content}<\/pre>"
    # create new line in console
    $out = $("<div/>", class: "line", html: lines.join(""))
    # show line and scroll to it
    output.$console
      .append($out)
      .stop()
      .animate(scrollTop: output.$console.get(0).scrollHeight)

  # alias console.log
  consoleLog = window.console.log
  window.console.log = ->
    log.apply @, arguments
    consoleLog.apply @, arguments

  showSourceError = (line, message)->
    source.$errors.show().text "[Line #{line}] #{message}"

  showGlobalError = (line, message, url)->
    output.$errors.show().text(message)

  hideErrors = ->
    source.$errors.hide()
    output.$errors.hide()

  evalOutput = ->
    eval(output.editor.getValue())

  # init ace editors
  source.editor = ace.edit source.$editor.get('0')
  output.editor = ace.edit output.$editor.get('0')

  # editor settings
  source.editor.setTheme("ace/theme/#{THEME}")
  source.editor.getSession().setMode('ace/mode/coffee')
  source.editor.getSession().setUseWrapMode(true)
  output.editor.setShowPrintMargin(false)
  source.editor.getSession().setTabSize(2)

  output.editor.setTheme("ace/theme/#{THEME}")
  output.editor.getSession().setMode('ace/mode/javascript')
  output.editor.setReadOnly(true)
  output.editor.setShowPrintMargin(false)
  output.editor.getSession().setUseWrapMode(true)

  # compile CS to JS on input
  source.editor.getSession().on "change", ->
    sourceValue = source.editor.getValue()
    hideErrors()
    try
      compiledValue = CoffeeScript.compile(sourceValue, bare: on)
      output.editor.setValue(compiledValue)
    catch e#{location, message}
      showSourceError(e.location.first_line + 1, e.message)


  # EVENTS

  # eval output
  output.$execute.on 'click', evalOutput

  # fullscreen toggle in heaer
  $('header .fullscreen').on 'click', -> $(document).toggleFullScreen()

  # key events
  $(document).on 'keydown', (e) ->
    # Ctrl + Enter => eval
    if e.which == 13 and (e.metaKey or e.ctrlKey)
      e.preventDefault()
      evalOutput()

    # Ctrl + F => fullscreen
    else if e.which == 70 and (e.metaKey or e.ctrlKey)
      e.preventDefault()
      $(document).toggleFullScreen()

  # display global errors in caused by eval
  $(window).on 'error', (e)->
    {lineno, message, filename} = e.originalEvent
    showGlobalError lineno, message, filename.replace(/^.*[\\\/]/, '')
