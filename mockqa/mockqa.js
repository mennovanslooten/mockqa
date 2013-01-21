;(function($, undefined) {
    var _url = $('script').last().attr('src');
    var _tests = [];
    var _base_url = _url.replace('mockqa.js', '');
    var _subscribers = [];
    var _check_delay = 500;


    var M = $.mockqa = {
        tests: [],

        log: function() {
            var args = [].slice.call(arguments, 0);
            args.unshift('[MOCKQA]');
            console.info.apply(console, args);
        },

        base_url: _base_url,

        subscribe: function(handler) {
            _subscribers.push(handler);
        },

        unsubscribe: function(handler) {
            var index = $.inArray(handler, _subscribers);
            if (index > -1) {
                _subscribers.splice(index, 1);
            }
        }
    };



    function getFirstActiveTest() {
        var active = null;
        $.each(M.tests, function(index, test) {
            switch (test.status) {
                case '':
                    case 'passed':
                    case 'failed':
                    break;

                default: 
                    active = test;
                    return false;
            }
        });
        //console.log('first active', active);
        return active;
    }
    

    var _prev_stringified = '';
    function checkForUpdates() {
        var curr_stringified = JSON.stringify(M.tests);
        var active = null;

        if (curr_stringified !== _prev_stringified) {
            active = getFirstActiveTest();

            $.each(_subscribers, function(index, handler) {
                if ($.isFunction(handler)) {
                    try {
                        handler(M.tests, active);
                    } catch (ex) {
                    }
                }
            });

            _prev_stringified = curr_stringified;
        }

        _check_delay = active ? 5 : 500;
        setTimeout(checkForUpdates, _check_delay);
    }


    /*
    var _prev_active = null;
    M.subscribe(function(tests, active) {
        if (_prev_active && _prev_active !== active) {
            console.log('previously:', _prev_active);
        }
        _prev_active = active;
    });
    */


    $(window).on('load', function() {
        //setInterval(checkForUpdates, _check_delay);
        setTimeout(checkForUpdates, _check_delay);
        //M.log('ready...');
    });

    $(window).on('beforeunload', function() {
        checkForUpdates();
    });


    // Load all resources
    $('head').append('<link rel="stylesheet" href="' + _base_url + 'mockqa.css" />');


    function addScript(file) {
        document.write('<script src="' + _base_url + file + '.js"></sc' + 'ript>');
    }


    // Bitovi's syn.js is used to simulate user actions
    // http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html
    addScript('lib/syn');

    // appendTo's jquery.mockjax.js is used to intercept/mock Ajax requests
    // http://enterprisejquery.com/2010/07/mock-your-ajax-requests-with-mockjax-for-rapid-development/
    addScript('lib/jquery.mockjax');

    // mockqa.ui.js maintains the menu
    addScript('mockqa.ui');

    // mockqa.tests.js runs the test actions
    addScript('mockqa.tests');

    // mockqa.assert.js holds all the UI assert methods
    addScript('mockqa.assert');

    // mockqa.data.js loads the test list, either from disk or from window.name
    addScript('mockqa.data');

})(jQuery);


