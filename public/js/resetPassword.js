(function()
{
	$(()=>{
		let $newPassword = $('#newPassword'),
			$newPasswordConf = $('#newPasswordConf'),
			resetKey = $('#resetKey').val(),
			$feedback = $('#feedback');
		
		$('#passwordFromResetButton').click(
			()=>{
				$.post(
					'/users/passwordReset',
					{
						newPassword:$newPassword.val(),
						newPasswordConf:$newPasswordConf.val(),
						resetKey:resetKey
					}
				).then(
					(response)=>{
						let data = JSON.parse(response);
						if(data.success)
						{
							$feedback.text('Password updated');
						}
						else
						{
							$feedback.text(data.error);
						}
					}
				);
				return false;
			}
		);
	});
})();