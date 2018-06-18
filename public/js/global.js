var $email, $password, $loginModal, $form;

(function(){
	$(function(){
		
		$email = $('#login_email');
		$password = $('#login_password');
		$loginModal = $('#loginModal');
		$form = $('#loginForm');
		$('#passwordForgotButton').click(passwordForgotten);
		
		$('#login_modal_link').click(function(evt){
			evt.preventDefault();
			$loginModal.modal();
		});
		$form.submit(tryToLogin);
	});
})();

function tryToLogin()
{
	console.log('Trying to post');
	
	$.post(
		'/users/tryToLogin',
		{
			email:$email.val(),
			password:$password.val()
		}
	).then(
		function(response)
		{
			let data = JSON.parse(response);
			if(data.success=='true')
			{
				window.location.replace('/');
			}
			else
			{
				$('#login_feedback').text(data.error);
			}
		}
	);
	
	return false;
}

function passwordForgotten()
{

}