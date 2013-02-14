(function($) {
	function initTabs() {
		var $root = $(this);
		var $targets = $root.children();

		var $first_tab;
		var $first_target;
		var $tabs = $();

		$targets.each(function() {
			var $target = $(this);
			var $tab = $target.children().first();
			$tabs = $tabs.add($tab);

			$first_tab = $first_tab || $tab;
			$first_target = $first_target || $target;
			
			$tab.addClass('tabs-tab');
			$target.addClass('tabs-target');

			$tab.insertBefore($first_target);

			$tab.on('click', function() {
				$tabs.removeClass('active');
				$tab.addClass('active');
				$targets.hide();
				$target.show();
			});
		});

		$tabs.first().trigger('click');
	}

	$('.tabs').each(initTabs);
})(jQuery, undefined);
