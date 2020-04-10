# Onboarding Web App
* When you create the app you must create a .env file with the following information:
```
APP_ID=CLIENT_ID_HERE
APP_PASSWORD=CLIENT_SECRET_HERE
APP_SCOPES=Directory.ReadWrite.All Group.Read.All Group.ReadWrite.All Mail.Read Mail.ReadWrite Mail.Send offline_access openid profile Sites.Read.All Sites.ReadWrite.All User.Read User.Read.All User.ReadBasic.All User.ReadWrite.All
REDIRECT_URI=http://localhost:3000/auth
```
* npm install to get json files and node_modules
* npm start to start server, it listens on port 3000
## TODO------------------------------------------------------------------------------
* Onboarding process for subcontractor
* Bootstrap a powershell script to add to DL
    * rn the new users created are saved in a json file as firstname, lastname, and
    email
* Make it so the select menu will update based on the amount of results
* Change the full time list from DL to an O365 app
    * rn I can only update the customers group and not full time cuz customers 
        is a security group
* Error with the password reset: Unable to update 
    the specified properties for on-premises mastered Directory Sync objects or 
    objects currently undergoing migration
* Currently the access token is stored in a cookie to bigger deployments create
    a database
* The password reset and add to DL are the only things that don't work rn
* Add a create sharepoint subsite
* I eventually wanna move the logs to a database

### DONE--------------------------------------------------------------------------------

* Make the assigning license dynamic
    * rn creates json data that holds and array of objects to save the 
        data of what licenses they need
   * save the license names into an arr and then loop the names in another arr
   ```
        for license names.length i++
            arr = []
            arr.push([{disabledPlans:[], skuId:licenses[license name[i]}])
            base_licenses = {
                addLicenses: arr,
            removeLicenses: []
        }
  ```
* Find out password polices
    * One uppercase, lowercase, special character, no words
* The error with license was the usage location must be set before 
    you can assign licenses
* Find license ids
    * acrobat = seperate
    * project = project 5
    * bluebeam = seperate
    * air_magenet = seperate
* What password is used when accounts are created
* Make sure licenses can return a false I just made it so that it will recurse once to add another license

     