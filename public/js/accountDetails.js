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

(function($){
    $(function()
        {
            $('#saveAccountSettingsButton').click(updateAccountSettings);
            $('#copyUserReferenceButton').click(copyUserReferenceToClipboard);
        }
    );
})(window.jQuery);