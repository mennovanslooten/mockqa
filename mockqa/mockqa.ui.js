;(function($, undefined) {
    var M = $.mockqa;
    var _ui = null;
    var _loaded = false;


    function loadMenu(tests, active) {
        if (_loaded) {
            return;
        }
        _loaded = true;

        $.ajax({
            url: M.base_url + 'menu.html',
            cache: false
        }).done(function(html) {
            _ui = $(html);
            $('body').append(_ui);
            addEventHandlers(tests);
            renderMenu(tests);
        });
    }


    function addEventHandlers(tests) {
        _ui.on('click', '[data-index]', function() {
            var index = parseInt($(this).data('index'), 10);
            var test = tests[index];
            test.status = 'queued';
            delete test.action_index;
            delete test.actions;
        });

        _ui.on('click', 'a', function(e) {
            e.stopPropagation();
        });

        _ui.on('click', 'h2', function() {
            $(this).next('ul').find('[data-index]').trigger('click');
        });

        $('#mockqa-testlist-reload').on('click', function() {
            M.tests.length = 0;
            window.name = '';
            location.reload();
        });

        $('#mockqa-testlist-runall').on('click', function() {
            _ui.find('[data-index]').trigger('click');
        });
    }


    function getProgress(test) {
        if (!test || !test.actions || !test.action_index) {
            return '';
        }
        var progress = Math.round(test.action_index / test.actions.length * 100);
        return progress + '%';
    }


    function renderMenu(tests, active) {
        // Group tests by start page
        var grouped = {};
        $.each(tests, function(index, test) {
            if (!(test.page in grouped)) {
                grouped[test.page] = [];
            }
            grouped[test.page].push({
                index: index,
                test: test
            });
        });

        html = '';
        $.each(grouped, function(page, items) {
            html += '<div class="mockqa-test-group"><h2>' + page + '</h2>';
            html += '<ul>';
            $.each(items, function(index, item) {
                var test_url = M.base_url + 'tests/' + item.test.test;
                html += '<li data-index="' + item.index + '">';
                html += '<div class="mockqa-test-name">' + item.test.test + '</div>';
                html += '<div class="mockqa-test-progress"/>';
                html += '<a class="mockqa-test-info" href="' + test_url + '">i</a></li>';
            });
            html += '</ul></div>';
        });
        
        $('#mockqa-testlist-body').html(html);

        updateMenu(tests, active);
    }


    function updateMenu(tests, active) {
        $.each(tests, function(index, test) {
            var item = _ui.find('[data-index="' + index + '"]');
            item.attr('class', 'mockqa-test-status-' + test.status);
            item.find('.mockqa-test-progress').text(getProgress(test));
        });
    }


    function showUI(tests, active) {
        //var is_running = !!active && active.status === 'running';
        //$('html').toggleClass('mockqa-active', is_running);
        setTimeout(function() {
            $('html').toggleClass('mockqa-active', tests.length > 0);
        }, 500);
    }


    M.subscribe(loadMenu);
    M.subscribe(updateMenu);
    M.subscribe(showUI);


})(jQuery);
