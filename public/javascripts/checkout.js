//checkout.js
//configuration with Stripe for credit card auth

var stripe = Stripe('pk_test_oCxzeU9ZmvyyvxunjDHgcxiF');
var elements = stripe.elements();

var card = elements.create('card');
card.mount('#card-element');

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('checkout-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}

var form = document.querySelector('#checkout-form');
form.addEventListener('submit', function(event) {
	event.preventDefault();
	var extraDetails = {
		name: form.querySelector('input[name=name]').value,
		address: form.querySelector('input[name=address]').value
	};
	stripe.createToken(card, extraDetails).then(function(result) {
		if (result.error) {
			// Inform the user if there was an error
			var errorElement = document.getElementById('card-errors');
			errorElement.textContent = result.error.message;
	    } else {
			// Send the token to your server
			stripeTokenHandler(result.token);
		}
	});
});

/*
var $form = $('#checkout-form');

$form.submit(function(event) {
	//clear form of any previous errors
	$errorElement.addClass('hidden');

	//only allow user to submit form once during validation
	$form.find('button').prop('disabled', true);

	//create token
	stripe.createToken(card).then(function(result) {
		if(result.error) {
			//display errors to user
			console.log("error is " + result.error);
			var $errorElement = $('#card-errors');
			$errorElement.text(result.error.message);
			$errorElement.removeClass('hidden');
		}
		else {
			//send token to server
			stripeTokenHandler(result.token);
		}
	});

	//don't send request to server until validation
	return false;
});
*/