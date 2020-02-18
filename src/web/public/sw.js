self.addEventListener('install', function (event) {
    var CACHE_NAME = 'static-v1';
    var urlsToCache = [
        '/',
        'bower_components/select2/dist/css/select2.min.css',
        'bower_components/bootstrap-daterangepicker/daterangepicker.css',
        'bower_components/dropzone/dist/dropzone.css',
        'bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css',
        'bower_components/fullcalendar/dist/fullcalendar.min.css',
        'bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css',
        'bower_components/slick-carousel/slick/slick.css',
        'icon_fonts_assets/font-awesome/css/font-awesome.min.css',
        'css/main.css?version=4.4.1',
        'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/popper.js/dist/umd/popper.min.js',
        'bower_components/moment/moment.js',
        'bower_components/chart.js/dist/Chart.min.js',
        'bower_components/select2/dist/js/select2.full.min.js',
        'bower_components/jquery-bar-rating/dist/jquery.barrating.min.js',
        'bower_components/ckeditor/ckeditor.js',
        'bower_components/bootstrap-validator/dist/validator.min.js',
        'bower_components/bootstrap-daterangepicker/daterangepicker.js',
        'bower_components/ion.rangeSlider/js/ion.rangeSlider.min.js',
        'bower_components/dropzone/dist/dropzone.js',
        'bower_components/editable-table/mindmup-editabletable.js',
        'bower_components/datatables.net/js/jquery.dataTables.min.js',
        'bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js',
        'bower_components/fullcalendar/dist/fullcalendar.min.js',
        'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js',
        'bower_components/tether/dist/js/tether.min.js',
        'bower_components/slick-carousel/slick/slick.min.js',
        'bower_components/bootstrap/js/dist/util.js',
        'bower_components/bootstrap/js/dist/alert.js',
        'bower_components/bootstrap/js/dist/button.js',
        'bower_components/bootstrap/js/dist/carousel.js',
        'bower_components/bootstrap/js/dist/collapse.js',
        'bower_components/bootstrap/js/dist/dropdown.js',
        'bower_components/bootstrap/js/dist/modal.js',
        'bower_components/bootstrap/js/dist/tab.js',
        'bower_components/bootstrap/js/dist/tooltip.js',
        'bower_components/bootstrap/js/dist/popover.js',
        'js/demo_customizer.js?version=4.4.1',
        'js/main.js?version=4.4.1',
        'js/qrcode.min.js',
        'js/ese.js',
        'js/permissions.js',
        'js/plugin_sam.js',
        'js/data-channels.js',
        'js/dave.js',
        'js/wizards.js',
        'js/plugin_dave.js'
    ];

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = 'static-v1';

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
