var
	suggest_count = 0,
	suggest_selected = 0,
	initial_input_value = '',
	history_queries = localStorage.getItem('search_history');

if (!history_queries) history_queries = [];
else history_queries = history_queries.split('|');


$(window).ready(function(){
	//   INIT
	history_html = createHtmlHistoryAdvices();
	$('#search_advice_wrapper').html(history_html);
	suggest_count = history_queries.length;
	
    $('#search').keyup(function(I) {
        switch(I.keyCode) {
            // Ignore this keys
			case 13:  // enter
			case 27:  // esc
			case 38:  // up arrow
			case 40:  // down arrow
			break;
			
			default:
				initial_input_value = $(this).val();
				let history_html = createHtmlHistoryAdvices($(this).val());
				if ((initial_input_value != '') && (initial_input_value.length > 1)){
					$.ajax({
						url: ajax_search_url,
						data: {input_value: $(this).val()},

						success: function(data) {
							$('#search_advice_wrapper').html(history_html+data.html_from_view).show();
							suggest_count = $('.advice_variant').length;
						}
					});
				}
				else {
					$('#search_advice_wrapper').html(history_html);
					suggest_count = $('.advice_variant').length;
				}
				break;
        }
    });
	
	
	$('#search').keydown(function(I){
		switch(I.keyCode) {
			case 13:  // enter
				createNewSearchQuery($(this).val());
				redirect();
			case 27:  // esc
				$('#search_advice_wrapper').hide();
				return false;
			break;
			
			// Follow the avices by the keyboard arrows
			case 38:  // up arrow
			case 40:  // down arrow
				I.preventDefault();
				if (suggest_count) {
					key_activate(I.keyCode);
				}
			break;
		}
	});
	
	// Click on an advice
	$('#search_advice_wrapper').on('click', '.advice_variant', function() {
		let query = $(this).data('value');
		$('#search').val(query);
		$('#search_advice_wrapper').fadeOut(350).html('');
		createNewSearchQuery(query);
		redirect();
	});
	
	// if we click anywhere on the website, we need to hide advice_search
	$('html').click(function(){
		$('#search_advice_wrapper').hide();
	});
	
	
	$('#search').click(function(event){
		if(suggest_count)
			$('#search_advice_wrapper').show();
		event.stopPropagation();
	});
	
	
	$('#search_advice_wrapper').on('click', '.delete-history-btn', function(event) {
		let history_query = $(event.currentTarget).parent().data('value').toString();
		let query_index = $.inArray(history_query, history_queries);
		
		if (query_index != -1) {
			history_queries.splice(query_index, 1);
		
			localStorage.setItem('search_history', history_queries.join('|'));

			let history_html = createHtmlHistoryAdvices($(this).val());
			$('#search_advice_wrapper').html(history_html);
			suggest_count = $('.advice_variant').length;
		}
		
		event.stopPropagation();
	});
	
});


function key_activate(key_code) {
	let $advices = $('#search_advice_wrapper div');
	$advices.eq(suggest_selected-1).removeClass('active');
	
	if (key_code == 40 && suggest_selected < suggest_count) {
		suggest_selected++;
	}
	else if (key_code == 38 && suggest_selected > 0) {
		suggest_selected--;
	}
	
	if (suggest_selected > 0) {
		$advices.eq(suggest_selected-1).addClass('active');
		$('#search').val($advices.eq(suggest_selected-1).data('value'));
	}
	else {
		$('#search').val(initial_input_value);
	}
}


function createNewSearchQuery(value) {
	// Write user search query to hisory in localStorage
	if (value) {
		let history_str;
		if (history_queries.length > 0) { // If we have history before. We can't save more than 4 history_query
			if (history_queries.length >= 4) {
				history_str = history_queries
											.slice(-3)
											.join('|');
				
			} else history_str = history_queries.join('|');
			history_str += '|'+value;
			
		} else history_str = value;
		
		localStorage.setItem('search_history', history_str);
	}
}



function createHtmlHistoryAdvices(input_val) {
	input_val = input_val || '';
	let html_history_advices = '';
	let $close_btn = '<button type="button" class="delete-history-btn" aria-label="Close">' +
					 '<span class="bi bi-x-lg" aria-hidden="true"></span>'+
					 '</button>';
	$.each(history_queries, function(index, value) {
		if (value.indexOf(input_val) != -1) {
			html_history_advices += '<div class="advice_variant history" data-value="'+value+'">';
			html_history_advices += (value.length > 18) ? value.slice(0, 17) + '...' : value;
			html_history_advices += $close_btn + '</div>';
		}
	});
	return html_history_advices;
}
