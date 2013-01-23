(function($, undefined) {
    var M = $.mockqa;
    var _action_delay = 100;
    var _retry_delay = 500;
    var _tries = 0;
    var _max_tries = 10;
    var _active_test = null;


    function nextAction() {
        if (_active_test) {
            _active_test.action_index++;
        }
        //test.action_index++;
    }


    function runTest(tests, active) {
        if (!active || active.status !== 'running') {
            _active_test = null;
            return;
        }

        _active_test = active;

        if (active.action_index === 0) {
            M.log('----------------------------------------------------------------');
            M.log('Starting test:', active.test, 'on', active.page);
        }

        if (active.actions.length <= active.action_index) {
            active.status = 'passed';
            M.log('PASSED!');
        } else {
            var action = parseLine(active.actions[active.action_index]);
            if (action) {
                executeAction(active, action);
            } else {
                nextAction();
            }
        }
    }


    function parseLine(line) {
        //console.log('parseLine', line);
        var command = line.match(/^(\w+)\s+(.+)$/);
        var log = line.match(/^(##.+)/);
        var result = null;

        if (command && command.length === 3) {
            var args = line.split(/\s{2,}/);
            if (args.length > 1) {
                result = {
                    type: args.shift(),
                    args: args
                };
            }
        } else if (log && log.length === 2) {
            result = {
                type: 'log',
                args: [null, log[1]]
            };
        }

        return result;
    }



    var _prev_target = $();
    var _prev_selector = '';
    function executeAction(test, action) {
        var type = action.type;
        var selector = action.args[0];
        var argument = action.args[1];
        var target;

        // Allow &-substitution with previous selector
        if (selector && selector.indexOf('&') === -1) {
            _prev_selector = selector;
        } else if (selector) {
            selector = selector.replace('&', _prev_selector);
        }

        var args = action.args.slice(1);
        args.unshift(selector);

        // First, try to find the action's target
        if (type in M.extensions) {
            target = M.extensions[type].apply(M.extensions, args);
        } else if (type in M.assert) {
            target = M.assert[type].apply(M.assert, args);
        } else if (type in Syn) {
            target = M.assert.assertVisible(selector).first();
        } else if (type === 'log') {
            target = $('body');
            M.log(argument);
        }

        // If the search has resulted in a target, highlight the target
        // and continue execute the action. Afterwards continue to the next
        // action.
        // Otherwise, try again until futile
        if (target && target.length) {
            //console.log(test.actions[test.action_index]);
            _prev_target.removeClass('mockqa-highlight');
            _prev_target = target;
            target.addClass('mockqa-highlight');
            if (type in Syn) {
                var input = {};
                if (argument) {
                    input = argument;
                    // Special Syn.js key codes
                    $.each({
                        '\b': /\\b/g,
                        '\r': /\\r/g,
                        '\t': /\\t/g
                    }, function(unescaped, escaped) {
                        input = input.replace(escaped, unescaped);
                    });
                }

                // Typing takes a long time, wait proceding until it's finished
                // Otherwise, we need to increase action_index immediately
                // because a page-reload could cancel it.
                if (type === 'type') {
                    Syn[type](input, target, nextAction);
                } else {
                    Syn[type](input, target);
                    nextAction();
                }
            } else {
                nextAction();
            }
        } else if (_tries < _max_tries) {
            _tries++;
            setTimeout(function() {
                executeAction(test, action);
            }, _retry_delay);
        } else {
            test.status = 'failed';
            M.log('FAILED! ', test.actions[test.action_index]);
        }
    }


    function loadPage(tests, active) {
        if (active && active.status === 'loaded') {
            active.action_index = 0;
            active.status = 'running';
            M.unsubscribe(runTest);

            setTimeout(function() {
                if (localStorage) {
                    localStorage.clear();
                }
                location.href = M.base_url + '../' + active.page;
            }, 500);
        }
    }


    M.subscribe(loadPage);
    M.subscribe(runTest);


})(jQuery);





