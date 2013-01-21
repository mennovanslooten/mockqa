$.mockqa.assert = {
    /* TODO:
        - assertNoDeadLinks
    - assertCSS/assertStyle
    -
        */
    assertPage: function(page) {
        var index = location.href.indexOf(page);
        return index === -1 ? null : $('body');
    },

    assertTitle: function(title) {
        return document.title !== title ? null : $('body');
    },

    assertVisible: function(selector) {
        return $(selector).filter(':visible:not(:animated)').not(function(index) {
            return $(this).closest('#mockqa-testlist').length !== 0;
        });
    },

    assertHidden: function(selector) {
        var visible = this.assertVisible(selector);
        return visible.length ? null : $('body');
        //return $(selector).filter(':hidden');
    },

    // This sort of works but we need a more flexible test that allows for
    // stuff like font-weight: bold === 600
    /*
        assertCSS: function(selector, css) {
        css = JSON.parse(css);
        var result = this.assertVisible(selector).filter(function() {
            var matches = true;
            var elt = $(this);
            $.each(css, function(prop, val) {
                if (elt.css(prop) !== val) {
                    console.log(selector, css, prop, elt.css(prop), 'is not', val);
                    matches = false;
                }
            });
            return matches;
        });
        return result;
    },
    */

    assertDisabled: function(selector) {
        return this.assertVisible(selector).filter(':disabled');
    },

    assertEnabled: function(selector) {
        return this.assertVisible(selector).filter(':enabled');
    },

    assertText: function(selector, text) {
        return this.assertVisible(selector).filter(':contains("' + text + '")');
        //return this.assertVisible(selector).filter(function() {
        //var elt_text = $.trim($(this).text());
        //elt_text = elt_text.replace(/\s+/g, ' ');
        //console.log(elt_text);
        //return elt_text.indexOf(text) !== -1;
        //});
    },

    assertNotClass: function(selector, class_name) {
        return this.assertVisible(selector).filter(':not(' + class_name + ')');
    },

    assertHasClass: function(selector, class_name) {
        return this.assertVisible(selector).filter(class_name);
    },

    assertValue: function(selector, value) {
        return this.assertVisible(selector).filter(function() {
            return $(this).val() == value;
        });
    },

    assertLength: function(selector, value) {
        var result = this.assertVisible(selector);
        value = parseInt(value, 10);
        if (result.length === value) {
            return value ? result : $('body');
        }
    },

    assertEmpty: function(selector) {
        return this.assertLength(selector, 0);
    },

    choose: function() {
        var args = [].slice.call(arguments, 0);
        var selector = args.shift();
        var result = this.assertVisible(selector);
        if (result.length) {
            result.val(args);
        }
        return result;
        //var option = $(selector);
        //var select = this.assertVisible(option.closest('select'));
        //var value = option.attr('value') || option.text();
        //select.val(value);
        //return select;
    },

    mockjax: function(url, filename) {
        $.mockjaxClear();
        console.log('mockjax', url, filename);
        var proxy = $.mockqa.base_url + 'tests/mockjax/' + filename;
        $.mockjax({
            log: function() {},
            url: url,
            proxy: proxy
        });
        return $('body');
    }
};
