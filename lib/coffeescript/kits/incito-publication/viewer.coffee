Incito = require 'incito-browser'
MicroEvent = require 'microevent'

class Viewer
    constructor: (el, @options = {}) ->
        @els =
            root: el
            incito: el.querySelector '.incito'
        @incito = new Incito @els.incito,
            incito: @options.incito
        
        trigger = @incito.trigger

        @incito.trigger = (args...) =>
            trigger.apply @incito, args
            @trigger.apply @, args
            
            return

        return
    
    start: ->
        @els.root.setAttribute 'data-started', ''
        @els.root.setAttribute 'tabindex', '-1'
        @els.root.focus()

        @incito.start()

        @_trackEvent
            type: 'x-incito-publication-opened',
            properties: {}

        @
    
    destroy: ->
        return
    
    _trackEvent: (e) ->
        type = e.type
        properties =
            id: @options.id
        eventTracker = @options.eventTracker

        properties[key] = value for key, value of e.properties

        eventTracker.trackEvent type, properties if eventTracker?

MicroEvent.mixin Viewer

module.exports = Viewer