import { error, getDeviceCategory, getPointer, getOrientation } from '../../util'
import SGN from '../../core'
import Controls from './controls'
import Viewer from './viewer'
import schema from '../../../graphql/incito.graphql'
import * as clientLocalStorage from '../../storage/client-local'
import * as clientSessionStorage from '../../storage/client-session'

export default class Bootstrapper
    constructor: (@options = {}) ->
        @deviceCategory = @getDeviceCategory()
        @pixelRatio = @getPixelRatio()
        @pointer = @getPointer()
        @orientation = @getOrientation()
        @time = @getTime()
        @locale = @getLocale()
        @maxWidth = @getMaxWidth()
        @featureLabels = @getFeatureLabels()
        @versionsSupported = ['1.0.0']

        return
    
    getDeviceCategory: ->
        getDeviceCategory()
    
    getPixelRatio: ->
        window.devicePixelRatio or 1
    
    getPointer: ->
        getPointer()
    
    getOrientation: ->
        orientation = getOrientation screen.width, screen.height
        orientation = 'horizontal' if orientation is 'quadratic'

        orientation
    
    getTime: ->
        new Date().toISOString()
    
    getLocale: ->
        localeChain = []
        locale = null

        if Array.isArray(navigator.languages) and navigator.languages.length > 0
            localeChain = localeChain.concat navigator.languages
        else if typeof navigator.language == 'string' and navigator.language.length > 0
            localeChain.push navigator.language
        else if typeof navigator.browserLanguage == 'string' and navigator.browserLanguage.length > 0
            localeChain.push navigator.browserLanguage

        localeChain.push 'en_US'

        for prefLocale in localeChain
            continue if not prefLocale?

            prefLocale = prefLocale.replace '-', '_'

            if /[a-z][a-z]_[A-Z][A-Z]/g.test prefLocale
                locale = prefLocale
                
                break

        locale
    
    getMaxWidth: ->
        if Math.abs(window.orientation) is 90
            Math.min @options.el.offsetWidth, screen.width
        else
            @options.el.offsetWidth
    
    getFeatureLabels: ->
        featureLabels = clientLocalStorage.get 'incito-feature-labels'
        featureLabels = [] if Array.isArray(featureLabels) is false

        featureLabels
    
    anonymizeFeatureLabels: ->
        count = @featureLabels.length
        vector = @featureLabels.reduce (acc, cur) ->
            if !acc[cur]
                acc[cur] = {
                    key: cur
                    value: 0
                }
            
            acc[cur].value++
            
            acc
        , {}

        Object.values(vector).map (featureLabel) ->
            key: featureLabel.key
            value: Math.round(featureLabel.value / count * 100) / 100

    fetch: (callback) ->
        @fetchDetails @options.id, (err, details) =>
            if err?
                callback err
            else
                @fetchCachedIncito details.incito_publication_id, (err1, incito) ->
                    if err1?
                        callback err1
                    else
                        callback null,
                            details: details
                            incito: incito
                    
                    return
            
            return
        
        return

    fetchDetails: (_id, callback) =>
        SGN.CoreKit.request
            url: "/v2/catalogs/#{@options.id}"
        , callback

        return
    
    fetchCachedIncito: (id, callback) ->
        storageKey = "incito-#{id}"
        data = clientSessionStorage.get storageKey

        if data? and data.incito? and data.width is @maxWidth
            return callback null, data.incito

        @fetchIncito id, (err1, incito) =>
            if err1?
                callback err1
            else
                clientSessionStorage.set storageKey,
                    width: @maxWidth
                    incito: incito

                callback null, incito
            
            return

    fetchIncito: (id, callback) ->
        SGN.GraphKit.request
            query: schema
            operationName: 'GetIncitoPublication'
            variables:
                id: id
                deviceCategory: 'DEVICE_CATEGORY_' + @deviceCategory.toUpperCase()
                pixelRatio: @pixelRatio
                pointer: 'POINTER_' + @pointer.toUpperCase()
                orientation: 'ORIENTATION_' + @orientation.toUpperCase()
                time: @time
                locale: @locale
                maxWidth: @maxWidth
                versionsSupported: @versionsSupported
                featureLabels: @anonymizeFeatureLabels @featureLabels
        , (err, res) ->
            if err?
                callback err
            else if res.errors and res.errors.length > 0
                callback error(new Error(), 'Graph request contained errors')
            else
                callback null, res.data.node.incito
            
            return

        return
    
    createViewer: (data) ->
        if not data.incito?
            throw error new Error(), 'You need to supply valid Incito to create a viewer'

        viewer = new Viewer @options.el,
            id: @options.id
            details: data.details
            incito: data.incito
            eventTracker: @options.eventTracker
        new Controls viewer
        self = @

        # Persist clicks on feature labels for later anonymization.
        SGN.CoreUIKit.on viewer.el, 'click', '.incito__view[data-feature-labels]', ->
            featureLabels = this.getAttribute('data-feature-labels').split ','

            self.featureLabels = self.featureLabels.concat featureLabels

            while self.featureLabels.length > 1000
                self.featureLabels.shift()
            
            clientLocalStorage.set 'incito-feature-labels', self.featureLabels
            
            return

        viewer
