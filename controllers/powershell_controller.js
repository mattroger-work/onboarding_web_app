/*
const Shell = require('node-powershell');

//init the powershell object
const ps = new Shell({
    executionPolicy: 'RemoteSigned',
    noProfile: true 
});

exports.change_password = function(pass, username){
    ps.addCommand('[string]$userName = "Matt.Roger@teksynap.com"');
    ps.addCommand('[string]$userPassword = "Helloworld32!"');
    ps.addCommand('[securestring]$secStringPassword = ConvertTo-SecureString $userPassword -AsPlainText -Force');
    ps.addCommand('[pscredential]$credObject = New-Object System.Management.Automation.PSCredential ($userName, $secStringPassword)');
    ps.addCommand('Connect-MsolService -Credential $credObject');
    ps.addCommand('Set-MsolUserPassword -UserPrincipalName "'+username+'" -NewPassword "'+pass+'"')
    ps.addCommand('Get-PSSession | Remove-PSSession')
    ps.invoke()
    .then(output => {
        console.log(output)
    })
    .catch(err => {
        console.log(err)
    })
    
}*/