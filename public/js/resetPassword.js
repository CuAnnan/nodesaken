(function()
{
	$(()=>{
		let $newPassword = $('#newPassword'),
			$newPasswordConf = $('#newPasswordConf'),
			resetKey = $('#resetKey').val();
		
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
						console.log(response);
					}
				);
				return false;
			}
		);
	});
})();