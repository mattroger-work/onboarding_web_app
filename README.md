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
* When I try to send an email with the autopilot pdf, it doesn't even send and responds with no errors

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

     