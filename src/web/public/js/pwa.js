//Loading the Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/web/sw.js');
    });
}


$(document).ready(function () {
    'use strict'

    //Creating Cookie System for PWA Hide
    function createCookie(e, t, n) { if (n) { var o = new Date; o.setTime(o.getTime() + 48 * n * 60 * 60 * 1e3); var r = "; expires=" + o.toGMTString() } else var r = ""; document.cookie = e + "=" + t + r + "; path=/" }
    function readCookie(e) { for (var t = e + "=", n = document.cookie.split(";"), o = 0; o < n.length; o++) { for (var r = n[o]; " " == r.charAt(0);) r = r.substring(1, r.length); if (0 == r.indexOf(t)) return r.substring(t.length, r.length) } return null }
    function eraseCookie(e) { createCookie(e, "", -1) }

    //Enabling dismiss button
    setTimeout(function () {
        $('.pwa-dismiss').on('click', function () {
            console.log('User Closed Add to Home / PWA Prompt')
            createCookie('Primechain_pwa_rejected_install', true, 1);
            $('#menu-install-pwa-android').modal('hide');
            $('#menu-install-pwa-ios').modal('hide');
        });
    }, 1500);

    //Add To Home Banners
    // var simulateAndroidBadge = $('.simulate-android-badge');
    // var simulateiPhonesBadge = $('.simulate-iphones-badge');
    // var simulateAndroidBanner = $('.simulate-android-banner');
    // var simulateiPhonesBanner = $('.simulate-iphones-banner');
    // var addToHome = $('.add-to-home');
    // var addToHomeIOS = 'add-to-home-ios';
    // var addToHomeAndroid = 'add-to-home-android';
    // var addToHomeIOSBanner = $('#menu-install-pwa-ios')
    // var addToHomeAndroidBanner = $('#menu-install-pwa-android')

    // addToHome.on('click', function () {
    //     setTimeout(function () { addToHome.removeClass(addToHomeIOS).removeClass(addToHomeAndroid); }, 250);
    //     addToHome.removeClass(addToHomeVisible)
    // });
    // simulateAndroidBadge.on('click', function () {
    //     addToHome.addClass(addToHomeVisible).addClass(addToHomeAndroid).removeClass(addToHomeIOS);
    // });
    // simulateiPhonesBadge.on('click', function () {
    //     addToHome.addClass(addToHomeVisible).addClass(addToHomeIOS).removeClass(addToHomeAndroid);
    // });
    // simulateAndroidBanner.on('click', function () {
    //     addToHomeIOSBanner.addClass('menu-active');
    // });
    // simulateiPhonesBanner.on('click', function () {
    //     addToHomeAndroidBanner.addClass('menu-active');
    // });

    //Detecting Mobile Operating Systems
    var isMobile = {
        Android: function () { return navigator.userAgent.match(/Android/i); },
        iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
        any: function () { return (isMobile.Android() || isMobile.iOS() || isMobile.Windows()); }
    };
    // var isInWebAppiOS = (window.navigator.standalone == true);
    // var isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);

    // //Firing PWA prompts for specific versions and when not on home screen.    
    if (isMobile.Android()) {
        console.log('Android Detected');

        function showInstallPromotion() {
            console.log('Triggering PWA Prompt for Android');
            if ($('#menu-install-pwa-android').length) {
                if (!readCookie('Primechain_pwa_rejected_install')) {
                    setTimeout(function () {
                        $('#menu-install-pwa-android').modal('show');
                    }, 1500);
                }
            }
        }
        var deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            showInstallPromotion();
        });


        $('.pwa-install').on('click', (e) => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice
                .then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        $('#menu-install-pwa-android').modal('hide')
                        console.log('User accepted the A2HS prompt');
                    } else {
                        $('#menu-install-pwa-android').modal('hide')
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
        });

        window.addEventListener('appinstalled', (evt) => {
            $('#menu-install-pwa-android').modal('hide')
        });
    }

    if (isMobile.iOS()) {
        if (!isInWebAppiOS) {
            console.log('iOS Detected');
            if ($('#menu-install-pwa-ios, .add-to-home').length) {
                if (!readCookie('Eazy_pwa_rejected_install')) {
                    console.log('Triggering PWA / Add to Home Screen Prompt for iOS');
                    setTimeout(function () {
                        $('.add-to-home').addClass('add-to-home-visible add-to-home-ios');
                        $('#menu-install-pwa-ios, .menu-hider').addClass('menu-active');
                    }, 1500);
                };
            }
        }
    }
});
