# Onboarding Web App
* When you create the app you must create a .env file with the following information:
```
APP_ID=
APP_PASSWORD=
APP_SCOPES=
REDIRECT_URI=
```

* Must create a created_users.json file
## TODO----------------------------------------------------------------------------
* Onboarding process for subcontractor
* Bootstrap a powershell script to add to DL
    * rn the new users created are saved in a json file as firstname, lastname, and
    email
* Make it so the select menu will update based on the amount of results
* Change the full time list from DL to an O365 app
    * rn I can only update the customers group and not full time cuz customers 
        is a security group
* What password is used when accounts are created
* So the email sends it adds to groups and takes them off the sharepoint site,
    but there is an error with the password reset: Unable to update 
    the specified properties for on-premises mastered Directory Sync objects or 
    objects currently undergoing migration
* Currently the access token is stored in a cookie to bigger deployments create
    a database

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
     