$(document).ready(function(){
	var dropZone = $('#upload-container');
	var maxFileSize = 5242880;  // 5МБ

  // --- Functions for Drag&Drop decoration  ---------
	$('#file-input').focus(function() {
		$('label').addClass('focus');
	})
	.focusout(function() {
		$('label').removeClass('focus');
	});

  // Turn off default actions for drag, dragstart and e.t.c
	dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function(){
		return false;
	});

	dropZone.on('dragover dragenter', function() {
		dropZone.addClass('dragover');
	});

	dropZone.on('dragleave', async function(e) {
		let dx = e.pageX - dropZone.offset().left;
		let dy = e.pageY - dropZone.offset().top;
		if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
			dropZone.removeClass('dragover');
		}
	});

  // ------ Function for working with files, confirmation and display preview on the site --------

  // Send files received by drag&drop and add a preview to the page
	dropZone.on('drop', function(e) {
		dropZone.removeClass('dragover');
		let files = e.originalEvent.dataTransfer.files;
		showAddConfirm(files);
	});

  // Send files received from input and add a preview to the page
	$('#file-input').change(function() {
		let files = this.files;
		showAddConfirm(files);
	});


  function showAddConfirm(files) {
    // Checking if file is image and size less than 5mb
    for (let i = 0; i < files.length; i++) {
      if ((files[i].size > maxFileSize) || !((files[i].type == 'image/png') || (files[i].type == 'image/jpeg'))) {
        swal({
          title: 'Упс...',
          text: 'Файл "'+files[i].name+'" превышает 5МБ или не является фотографией',
          icon: 'error'
        });
        return false;
      }
    }

    swal({
      title: 'Вы уверены?',
      text: 'Вы уверены, что хотите добавить изображение(-ия)?',
      icon: 'warning',
      buttons: ['Отмена', 'Да, добавить!']
    })
    .then((willAdd) => {
      if (willAdd) {
        $(files).each(function(index, file) {
          sendFiles(file);
        });
      }
    });
  }


  $('.preview-container').on('click', '.close-btn', function (event){
    // Function for cross button
    swal({
      title: 'Вы уверены?',
      text: 'Вы уверены, что хотите удалить изображение(-ия)?',
      icon: 'warning',
      buttons: ['Отмена', 'Да, удалить!'],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        let image_id = $(event.currentTarget).next().attr('id');
        sendRemoveRequest(image_id);
      }
    });
  });

  function removeImage(image_id) {
    let img = $('#'+image_id);
    removeImgID = img.attr('id');
    URL.revokeObjectURL(img.attr('src'));
    img.parent('.preview-image').remove();
  }

  function addNewImage(blobURL, image_id) {
    // Прошу прощения за кривой код, я не знаю js и jquery :D
    // Function add html with new image and button, that delete image

    var closeBtn = '<button type="button" class="close-btn" aria-label="Close"><span aria-hidden="true"><i class="bi bi-x-lg"></i></span></button>'
    var img = '<img class="img-thumbnail" id="'+ image_id + '" src="'+ blobURL +'">'
    $('.preview-container').append('<div class="preview-image"></div>');
    let preview = $('.preview-image').last();
    preview.html(closeBtn + img);
  }

  // --------------------- AJAX responses -------------------------

	function sendFiles(file) {
	// Sends a AJAX-request to the server for adding new photos
		let form = $('#drop-form-js');
		let Data = new FormData();
    Data.append('image', file);
		Data.append('csrfmiddlewaretoken', $.cookie('csrftoken'));
		Data.append('product', window.location.href.split('/')[4]);

		$.ajax({
			url: form.attr('action'),
			type: form.attr('method'),
			data: Data,
			contentType: false,
			processData: false,
			success: function(data) {
			  swal({
			    title: 'Успешно добавлено!',
			    text: 'Изображение(-ия) успешно добавлено(-ы)',
			    icon: 'success'
			  });
				let blobURL = URL.createObjectURL(file);
		    addNewImage(blobURL, data['image_id']);
			},

			error: function(response) {
        swal({
			    title: 'Упс...',
			    text: response.responseJSON.error || 'Не удалось добавить изображение(-ия)',
			    icon: 'error'
			  });
      }
		});
	}


	function sendRemoveRequest(image_id) {
	// Sends a AJAX-request to the server for removing photos
		let form = $('#drop-form-js');
		let Data = new FormData();
		Data.append('csrfmiddlewaretoken', $.cookie('csrftoken'));
		Data.append('image_id', image_id);
		Data.append('product', window.location.href.split('/')[4]);

		$.ajax({
			url: '/_remove_image/',
			type: 'POST',
			data: Data,
			contentType: false,
			processData: false,
			success: function(data) {
			  swal({
			    title: 'Успешно удалено!',
			    text: 'Изображение(-ия) успешно удалено(-ы)',
			    icon: 'success'
			  });
				removeImage(data['image_id']);
			},

			error: function(response) {
        swal({
			    title: 'Упс...',
			    text: response.responseJSON.error || 'Не удалось удалить изображение',
			    icon: 'error'
			  });
      }
		});
	}

})
