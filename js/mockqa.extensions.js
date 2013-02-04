;(function($, undefined) {
    var DEFAULT = $('body');
    var _mockjaxed = {};
    var Assert = $.mockqa.assert;

    $.mockqa.extensions = {
        choose: function() {
            var args = [].slice.call(arguments, 0);
            var selector = args.shift();
            var result = Assert.assertVisible(selector);
            if (result.length) {
                result.val(args);
            }

            return result;
        },

        mockjax: function(url, filename) {
            if (url in _mockjaxed) {
                $.mockjaxClear(_mockjaxed[url]);
                delete _mockjaxed[url];
            }

            if (filename) {
                console.info('mockjax', url, filename);
                var proxy = $.mockqa.tests_path + '/mockjax/' + filename;
                _mockjaxed[url] = $.mockjax({
                    log: function() {},
                    url: url,
                    proxy: proxy
                });
            }

            return DEFAULT;
        }

    };
})(jQuery);
