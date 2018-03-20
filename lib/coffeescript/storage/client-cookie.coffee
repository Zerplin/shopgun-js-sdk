import { isNode } from '../util'

prefixKey = 'sgn-'

export get = (key) ->
    return if isNode()

    try
        name = "#{prefixKey}#{key}="
        ca = document.cookie.split ';'

        for c in ca
            ct = c.trim()

            value = ct.substring(name.length, ct.length) if ct.indexOf(name) is 0

        value = JSON.parse value
    catch err
        value = {}

    value

export set = (key, value) ->
    return if isNode()

    try
        days = 365
        date = new Date()
        str = JSON.stringify value

        date.setTime date.getTime() + days * 24 * 60 * 60 * 1000

        document.cookie = "#{prefixKey}#{key}=#{str};expires=#{date.toUTCString()};path=/"
    catch err

    return


