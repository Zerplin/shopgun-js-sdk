(function () {
    var bootstrapper = new SGN.PagedPublicationKit.Bootstrapper({
        el: document.querySelector('.sgn__pp'),
        id: SGN.util.getQueryParam('id') || '0852mDU',
        eventTracker: SGN.config.get('eventTracker')
    });

    bootstrapper.fetch(function (err, data) {
        if (!err) {
            var viewer = bootstrapper.createViewer(data);

            viewer.bind('hotspotClicked', function (hotspot) {
                console.log('Hotspot clicked', hotspot);
                
                // For example, if you want to redirect to a webshop link if one is set on the offer
                if (hotspot.webshop) {
                    window.location = hotspot.webshop;
                }
            });

            viewer.bind('hotspotPressed', function (hotspot) {
                console.log('Hotspot pressed', hotspot);
            });

            viewer.bind('hotspotContextmenu', function (hotspot) {
                console.log('Hotspot contextmenu', hotspot);
            });

            viewer.start();

            // Fetch hotspots after rendering the viewer as they are not critical for initial render.
            bootstrapper.fetchHotspots(function (err2, hotspots) {
                if (!err2) {
                    bootstrapper.applyHotspots(viewer, hotspots);
                }
            });
        } else {
            console.log(err);
        }
    });
})();
