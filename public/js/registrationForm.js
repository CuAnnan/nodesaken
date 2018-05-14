function validatePassword(password)
{
	if(password.length < 8)
	{
		return 'Passwords must be at least 8 characters long';
	}
	else if(password.length < 13 && !(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^a-z^A-Z\d]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, one lower case letter, one number, and one character that is not a letter or number';
	}
	else if(password.length < 16 && !(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, one lower case letter, and one number';
	}
	else if(password.length < 20 && !(password.match(/[a-z]/) && password.match(/[A-Z]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, and one lower case letter';
	}
	return null;
}


function validateForm($form)
{
	let validates = true;
	$('input', $form).each(function(){
		let $input = $(this),
			required = $input.attr('required'),
			type = $input.attr('type'),
			$error = $('.alert-danger', $input.closest('.row')).empty();
		if(required && ((type=='checkbox' && !$input.is(':checked')) || (type !== 'checkbox' && !$input.val())))
		{
			$error.text('This field is required');
			validates = false;
		}
		if($input.attr('id') == 'password')
		{
			let error = validatePassword($input.val());
			if(error)
			{
				$error.text(error);
				validates = false;
			}
			if($input.val() !== $('#passwordConfirmation').val())
			{
				$error.text('Password and password confirmation do not match');
			}
		}
	});
	return validates;
}

(function(){
	$(
		function()
		{
			let $form = $('#registerForm');
			$form.submit(()=>{
				let errors = validateForm($form);
				console.log(errors);
				return errors;
			});
			$('.modalLink').click(function(evt)
			{
				evt.preventDefault();
				let $link = $(evt.currentTarget);
				let modalId = $link.attr('id').replace('Link', '');
				console.log(modalId);
				$('#' + modalId).modal();
				
			});
		}
	);
})();