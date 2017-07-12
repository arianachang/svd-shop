//checkout.js
//configuration with Stripe for credit card auth

var stripe = Stripe('pk_test_oCxzeU9ZmvyyvxunjDHgcxiF');
var elements = stripe.elements();
var card = elements.create('card');
card.mount('#card-element');

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}

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

/*
$form.submit((event) => {
	$form.find('button').prop('disabled', true);
	Stripe.card.createToken({
		number: $('#card-number').val(),
		cvc: $('#card-cvc').val(),
		exp_month: $('#card-expiry-month').val(),
		exp_year: $('#card-expiry-year').val(),
		name: $('#card-name').val()
	}, stripeResponseHandler);
});

function stripeResponseHandler(status, response) {

}*/