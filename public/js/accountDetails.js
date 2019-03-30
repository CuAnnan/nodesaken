function updateAccountSettings()
{
    let data = {
        displayName:$('#displayName').val(),
        currentPassword:$('#currentPassword').val(),
        newPassword:$('#newPassword').val(),
        confirmNewPassword:$('#confirmNewPassword').val()
    };
    $.post('/users/account', data).then(

    );
}

function copyUserReferenceToClipboard()
{
    let userKey = $('#userKey').val();
    let $tmp = $('<input/>').appendTo($('body')).val(userKey).select();
    document.execCommand('copy');
    $tmp.remove();
}

function updateDiscordUserStatus(status)
{
    let $button = $(this),
        discordUserReference = $button.closest('.col').data('discordUserReference');
    $.ajax(
        `/discordUsers/${status}/${discordUserReference}`,
        {
            method:'PATCH'
        }
    ).then(
        (data)=>{
            data = JSON.parse(data);
            $button.closest('.col').siblings('.discordStatus').first().text(data.status);

        }
    );
}

function rejectDiscordUser()
{
    updateDiscordUserStatus.call(this, 'reject');
}

function approveDiscordUser()
{
    updateDiscordUserStatus.call(this, 'approve');
}

(function($){
    $(function()
        {
            $('#saveAccountSettingsButton').click(updateAccountSettings);
            $('#copyUserReferenceButton').click(copyUserReferenceToClipboard);
            $('.discordUserReject').click(rejectDiscordUser);
            $('.discordUserApprove').click(approveDiscordUser);
        }
    );
})(window.jQuery);