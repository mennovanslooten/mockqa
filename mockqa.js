;(function($, undefined) {
    var _mockqa_path = $('script').last().attr('src').replace('mockqa.js', '');
    var _tests_path = $('script').last().data('tests');
    var _url = $('script').last().attr('src');
    var _tests = [];
    var _mockqa_url = _url;
    var _subscribers = [];
    var _check_delay = 500;


    var M = $.mockqa = {
        tests: [],

        log: function() {
            try {
                var args = [].slice.call(arguments, 0);
                args.unshift('[MOCKQA]');
                console.log.apply(console, args);
            } catch (ex) {
            }
        },

        //base_url: _base_url,

        mockqa_path: _mockqa_path,
        
        tests_path: _tests_path,

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
                        console.log('Exception calling subscriber:', ex);
                        //active.status = 'failed';
                        //return false;
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
        window.scrollTo(0, 0);
    });

    $(window).on('beforeunload', function() {
        checkForUpdates();
    });


    // Load all resources
    $('head').append('<link rel="stylesheet" href="' + _mockqa_path + 'menu/mockqa.css" />');


    function addScript(file) {
        document.write('<script src="' + _mockqa_path + 'js/' + file + '.js"></sc' + 'ript>');
    }


    // Bitovi's syn.js is used to simulate user actions
    // http://bitovi.com/blog/2010/07/syn-a-standalone-synthetic-event-library.html
    addScript('syn');

    // appendTo's jquery.mockjax.js is used to intercept/mock Ajax requests
    // http://enterprisejquery.com/2010/07/mock-your-ajax-requests-with-mockjax-for-rapid-development/
    addScript('jquery.mockjax');

    // mockqa.ui.js maintains the menu
    addScript('mockqa.ui');

    // mockqa.tests.js runs the test actions
    addScript('mockqa.tests');

    // mockqa.assert.js holds all the UI assert methods
    addScript('mockqa.assert');

    // mockqa.extensions.js can hold custom extension actions
    addScript('mockqa.extensions');

    // mockqa.data.js loads the test list, either from disk or from window.name
    addScript('mockqa.data');

})(jQuery);


