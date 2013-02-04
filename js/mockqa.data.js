;(function($, undefined) {
    var M = $.mockqa;


    function init() {
        //debugger;
        var tests = [];
        try {
            tests = JSON.parse(window.name);
            M.tests = tests;
        } catch(ex) { }

        if (!tests.length) {
            loadTestList();
        }
    }


    function loadTestList() {
        $.ajax({
            url: M.tests_path + '/testlist',
            cache: false
        }).done(function(text) {
            var lines = getLineArray(text);
            $.each(lines, function(index, line) {
                if (line.indexOf('#') === 0) {
                    return;
                }
                var parts = line.split(/\s+/);

                M.tests.push({
                    test: parts[0],
                    page: parts[1],
                    status: ''
                });
            });
        });
    }


    function loadQueued(tests, active) {
        if (active && active.status === 'queued') {
            loadTest(active);
        }
    }


    function loadTest(test) {
        if (test.actions && test.actions.length) {
            return;
        }

        $.ajax({
            url: M.tests_path + '/' + test.test,
            cache: false
        }).done(function(text) {
            test.actions = getLineArray(text);
            resolveIncludes(test);
        });
    }


    function resolveIncludes(test) {
        var include_index = null;
        $.each(test.actions, function(index, action) {
            if (action.indexOf('@include') === 0) {
                include_index = index;
            }
        });

        if (include_index !== null) {
            loadInclude(test, include_index);
        } else {
            test.status = 'loaded';
        }
    }


    function loadInclude(test, include_index) {
        var include_action = test.actions[include_index];
        /*
        var matches = include_action.match(/'(.+)'/);

        if (!matches || matches.length !== 2) {
            return;
        }
        var include_file = matches[1];
        */
        var parts = include_action.split(/\s{2,}/);
        if (parts.length !== 2) {
            return;
        }

        var include_file = parts[1];

        $.ajax({
            url: M.tests_path + '/' + include_file,
            cache: false
        }).done(function(text) {
            var actions = getLineArray(text);
            var args = [include_index, 1].concat(actions);
            test.actions.splice.apply(test.actions, args);
            resolveIncludes(test);
        });
    }


    function getLineArray(text) {
        var lines = text.split(/\n+/);
        var result = [];
        $.each(lines, function(index, line) {
            line = $.trim(line);
            if (line /*&& line.indexOf('#') !== 0*/) {
                result.push(line);
            }
        });
        return result;
    }


    function storeData(tests) {
        window.name = JSON.stringify(tests);
    }
    

    M.subscribe(storeData);
    M.subscribe(loadQueued);


    $(window).on('load', init);


})(jQuery);
