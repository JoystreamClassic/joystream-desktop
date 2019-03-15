/**
 * Created by bedeho on 18/10/2017.
 */

function hide () {
    var doorbellButton = document.getElementById('doorbell-button')
    if (doorbellButton) {
        doorbellButton.style.display = 'none'
    }
}

function show () {
    var doorbellButton = document.getElementById('doorbell-button')
    if (doorbellButton) {
        doorbellButton.style.display = 'block'
    }
}
window.doorbellOptions = {
    appKey: 'Z8RYHGIQeb7QeVtJD1HLn0fMZlhQgPovzorgfutn8gnCuLfTP8t2d3LnybV2Ow1s'
}

function load () {
    window.doorbellOptions.windowLoaded = true
    var g = document.createElement('script')
    g.id = 'doorbellScript'
    g.type = 'text/javascript'
    // Weirdely if Remove the ';' I have an error...
    g.src = 'https://embed.doorbell.io/button/7029?t='+(new Date().getTime());
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(g)
}

module.exports.load = load
module.exports.hide = hide
module.exports.show = show