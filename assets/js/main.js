/*
	Radius by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

var BID_API_URL = '/api/bid';

function showModal(image) {
	var modal = document.getElementById('modal');
	var modalImage = document.getElementById('modal-image');
	var artworkTitle = document.getElementById('modal-artwork-title');
	var artworkInput = document.getElementById('bid-artwork');
	var feedback = document.getElementById('bid-feedback');
	var form = document.getElementById('bid-form');
	var title = image.alt || image.src.split('/').pop();

	modalImage.src = image.src;
	modalImage.alt = title;
	artworkTitle.textContent = title;
	artworkInput.value = title;
	feedback.textContent = '';
	feedback.className = 'bid-feedback';
	if (form) {
		form.reset();
		artworkInput.value = title;
	}

	modal.classList.add('is-open');
	modal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-open');
}

function hideModal() {
	var modal = document.getElementById('modal');
	modal.classList.remove('is-open');
	modal.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-open');
}

function submitBid(event) {
	event.preventDefault();

	var form = event.target;
	var feedback = document.getElementById('bid-feedback');
	var submitBtn = form.querySelector('.bid-submit');
	var payload = {
		artwork: form.artwork.value.trim(),
		name: form.name.value.trim(),
		contact: form.contact.value.trim(),
		amount: parseFloat(form.amount.value, 10),
		message: form.message.value.trim()
	};

	if (!payload.name || !payload.contact || !payload.amount || payload.amount < 1) {
		feedback.textContent = 'Please fill in your name, contact details, and a valid bid amount.';
		feedback.className = 'bid-feedback bid-feedback--error';
		return;
	}

	submitBtn.disabled = true;
	feedback.textContent = 'Submitting…';
	feedback.className = 'bid-feedback';

	fetch(BID_API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
		.then(function(response) {
			if (!response.ok) {
				throw new Error('Server rejected bid');
			}
			return response.json();
		})
		.then(function() {
			feedback.textContent = 'Thank you — your bid has been recorded. The gallery will be in touch.';
			feedback.className = 'bid-feedback bid-feedback--success';
			form.reset();
			form.artwork.value = payload.artwork;
		})
		.catch(function() {
			feedback.textContent = 'Could not reach the server. Run the site with: python bid_server.py';
			feedback.className = 'bid-feedback bid-feedback--error';
		})
		.finally(function() {
			submitBtn.disabled = false;
		});
}

document.addEventListener('DOMContentLoaded', function() {
	var form = document.getElementById('bid-form');
	if (form) {
		form.addEventListener('submit', submitBid);
	}

	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			hideModal();
		}
	});
});
(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$footer = $('#footer');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Header.
			$header.each( function() {

				var t 		= jQuery(this),
					button 	= t.find('.button');

				button.click(function(e) {

					t.toggleClass('hide');

					if ( t.hasClass('preview') ) {
						return true;
					} else {
						e.preventDefault();
					}

				});

			});

		// Footer.
			$footer.each( function() {

				var t 		= jQuery(this),
					inner 	= t.find('.inner'),
					button 	= t.find('.info');

				button.click(function(e) {
					t.toggleClass('show');
					e.preventDefault();
				});

			});

	});

})(jQuery);