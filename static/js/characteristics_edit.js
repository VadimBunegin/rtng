
function edit_char(cat_id, char_id) {
	let $btn = $('#char_'+char_id).next().find('a.btn');
	let $btn_icon = $btn.find('i');
	let $td_char = $('#char_'+char_id);
	let $char_info = $td_char.find('.js-info');
	let $char_form = $td_char.find('.js-form');

	if ($btn_icon.hasClass('fa-pen-to-square')) { // If we want to see the form
		if (!$td_char.hasClass('js-has-form')) {  // If we made ajax-request for this before
			// Send GET-request to server to receive form
			let ajax_url = '/categories/' + String(cat_id) + '/characteristics/' + String(char_id) + '/edit/';
			$.ajax({
				url: ajax_url,

				success: function(data) {
					$char_info.hide();
					$td_char.append('<div class="js-form">'+data+'</div>');
					$td_char.addClass('js-has-form');
				}
			});
		} else {
			$char_info.hide();
			$char_form.show();
		}

	} else {  // if we want to hide the form
		$char_info.show();
		$char_form.hide();
	}

	change_btn_classes($btn_icon, $btn);
}


function change_btn_classes($btn_icon, $btn) {
	if ($btn_icon.hasClass('fa-pen-to-square')) {
		$btn_icon.removeClass('fa-pen-to-square');
		$btn_icon.addClass('fa-eye-slash');

		$btn.removeClass('btn-primary');
		$btn.addClass('btn-secondary');
	} else {
		$btn_icon.removeClass('fa-eye-slash');
		$btn_icon.addClass('fa-pen-to-square');

		$btn.removeClass('btn-secondary');
		$btn.addClass('btn-primary');
	}
}
