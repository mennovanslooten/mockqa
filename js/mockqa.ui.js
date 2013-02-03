;(function($, undefined) {
    var M = $.mockqa;
    var _ui = null;
    var _loaded = false;


    function queueTest(test) {
        test.status = 'queued';
        delete test.action_index;
        delete test.actions;
    }


    function loadMenu(tests, active) {
        if (_loaded) {
            return;
        }
        _loaded = true;

        $.ajax({
            url: M.base_url + 'menu/menu.html',
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
            queueTest(tests[index]);
        });

        _ui.on('click', 'a', function(e) {
            e.stopPropagation();
        });

        _ui.on('click', 'h2', function() {
            $(this).next('ul').find('[data-index]').trigger('click');
        });

        _ui.on('click', '.mockqa-test-info', function(e) {
            e.preventDefault();

            var link = $(this);
            var url = link.attr('href');
            var test = link.closest('[data-index]').find('.mockqa-test-name').text();

            $.ajax({
                url: url,
                cache: false
            }).done(function(text) {
                var info = $('#mockqa-testinfo');
                info.find('h1').text(url);
                info.find('pre').html(text);
                info.show();

                $(document).one('click', function() {
                    info.hide();
                });
            });
        });

        $('#mockqa-testlist-reload').on('click', function() {
            M.tests.length = 0;
            window.name = '';
            location.reload();
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
        if (!_ui) {
            return;
        }
        $.each(tests, function(index, test) {
            var item = _ui.find('[data-index="' + index + '"]');
            var new_class = 'mockqa-test-status-' + test.status;
            if (!item.hasClass(new_class)) {
                item.attr('class', new_class);
            }
            item.find('.mockqa-test-progress').text(getProgress(test));
            //var is_current_page = location.href.indexOf(active.page) > -1;
            //item.closest('mockqa-test-group').toggleClass('mockqa-current-page', is_current_page);
        });
    }


    function showUI(tests, active) {
        var is_loaded = tests.length > 0;
        if (is_loaded) {
            var is_running = !!active;

            $('html').toggleClass('mockqa-loaded', is_loaded);
            $('html').toggleClass('mockqa-running', is_running);
        }
    }

    var _active;
    function traceActive(tests, active) {
        if (!active && _active || (active && _active && active !== _active)) {
            console.log('previously active', _active);
            //var item = _ui.find('[data-index="' + index + '"]');
        }
        _active = active;
    }


    function autoStart(tests, active) {
        if (!tests.length) {
            return;
        } else if (!active) {
            var autostart = location.search.match(/mockqa-autostart-test=(.+)/);
            if (autostart && autostart.length === 2) {
                $.each(tests, function(index, test) {
                    if (location.href.indexOf(test.page) > -1 && test.test === autostart[1]) {
                        queueTest(test);
                        return false;
                    }
                });
            }
            return false;
        }
    }


    M.subscribe(loadMenu);
    M.subscribe(updateMenu);
    M.subscribe(showUI);
    M.subscribe(traceActive);
    M.subscribe(autoStart);


})(jQuery);
