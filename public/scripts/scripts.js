      //Create the hq table
      function Create_hq_Table(table_obj){
        var element = '';
        //table head
        table_head = 
        '<table id="table_root" class="table">' +
        '<thead class="thead-light">' +
          '<th scope="col">First Name</th>' +
          '<th scope="col">Last Name</th>' +
          '<th scope="col">Start Date</th>' +
          '<th scope="col">Personal Email</th>' +
          '<th scope="col">AD Import</th>' +
          '<th scope="col">IT Letter Sent</th>' +
          '<th scope="col">Licenses</th>' +
          '<th scope="col">Postition</th>'+
          '<th scope="col">Onboard</th>' 
        '</thead>' +
        '<tbody>'
        table = document.createElement("table");
        document.getElementById("root").replaceWith(table);
        table.id = "table_root";
        table.className = "table";
        
        //Add the table head to the html
        document.getElementById("table_root").innerHTML = table_head;
        
        //for each loop to create the ele of the table
       JSON.parse(table_obj).forEach(obj => {
          //clean up the date
          date = new Date(obj.fields.DueDate);
          //months start a 0
          month = date.getMonth() < 12 ? date.getMonth() + 1 : 1
          due_date = month +'/'+ date.getDate() +'/'+ date.getFullYear();
          last_name = parse_name(obj.fields.Title);
          per_email = parse_email(obj.fields.Personal_x0020_Email);
         //clean up licences
         if(obj.fields.Licenses_x0020_Needed){
           licenses = obj.fields.Licenses_x0020_Needed;
         }else{
           licenses = false;
         }
          element += (
            "<tr>" +
              "<td>" + obj.fields.Employee_x0020_Name_x0020_First + "</td>" +
              "<td>" + last_name + "</td>" +
              "<td>" + due_date + "</td>" +
              "<td>" + per_email + "</td>" +
              "<td>" + obj.fields.Active_x0020_Directory_x0020_Imp + "</td>" +
              "<td>" + obj.fields.IT_x0020_Welcome_x0020_Email_x00 + "</td>" +
              "<td>" + licenses + "</td>" +
              "<td>" + obj.fields.Position_x0020_Title + "</td>"+
              "<td><button onclick=\"onboard('"+licenses+"','"+obj.id+"','"+last_name+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+obj.fields.DueDate+"','"+per_email+"','"+obj.fields.Active_x0020_Directory_x0020_Imp+"','"+obj.fields.IT_x0020_Welcome_x0020_Email_x00+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        //add the ele and the table footer
        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';
      }

      //create the sub-contractors table
      function Create_Table_sub(table_obj){
        var element = '';
        //table head
        table_head = 
        '<table id="table_root" class="table">' +
        '<thead class="thead-light">' +
          '<th scope="col">First Name</th>' +
          '<th scope="col">Last Name</th>' +
          '<th scope="col">Start Date</th>' +
          '<th scope="col">Personal Email</th>' +
          '<th scope="col">Onboard</th>' +
        '</thead>' +
        '<tbody>'
        table = document.createElement("table");
        document.getElementById("root").replaceWith(table);
        table.id = "table_root";
        table.className = "table";
        
        //Add the table head to the html
        document.getElementById("table_root").innerHTML = table_head;
        
        //for each loop to create the ele of the table
       JSON.parse(table_obj).forEach(obj => {
          //clean up the date
          date = new Date(obj.fields.Start_x0020_Date);
          month = date.getMonth() < 12 ? date.getMonth() + 1 : 1
          due_date = month + '/' + date.getDate() + '/' + date.getFullYear();
          last_name = parse_name(obj.fields.Employee_x0020_Name_x0020_Last);
         //clean up licences
         if(obj.fields.Licenses_x0020_Needed0){
           licenses = obj.fields.Licenses_x0020_Needed0;
         }else{
           licenses = false;
         }
          element += (
            "<tr>" +
              "<td>" + obj.fields.Employee_x0020_Name_x0020_First + "</td>" +
              "<td>" + last_name + "</td>" +
              "<td>" + due_date + "</td>" +
              "<td>" + obj.fields.Title + "</td>" +
              "<td><button onclick=\"onboard_sub('"+obj.fields.Title+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+last_name+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        //add the ele and the table footer
        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';

      }

      function onboard_sub(per_email, first_name, last_name){
        obj = {
          "per_email":per_email,
          "first_name":first_name,
          "last_name":last_name
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
          if(this.readyState == 4){
            console.log(this.responseText);
            window.alert(this.responseText);
            window.location = "/onboard/sub";
          }else{
            //loading signal icon here
          }
        }
        xhttp.open("POST", "/onboard/sub", true);
        xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhttp.send(JSON.stringify(obj));


      }

      //the actual onboarding function this organizes the data from the table to send
      function onboard(licenses, id, title, fName, dueDate, pEmail, adImp, wel){
        e3 = /E3+/g.test(licenses);
        e1 = /E1+/g.test(licenses);
        e5 = /E5+/g.test(licenses);
        project = /Project+/g.test(licenses);
        visio = /Visio+/g.test(licenses);
        
        obj = {
          "last_name": title,
          "first_name": fName,
          "due_date": dueDate,
          "per_email": pEmail,
          "ad_imp": adImp,
          "wel": wel,
          "share_id": id,
          "tek_email": fName + '.' + title + '@teksynap.com',
          "licenses":[
              {name: "e3", bool: e3},
              {name: "e1", bool: e1},
              {name: "e5", bool: e5},
              {name: "project", bool: project},
              {name: "visio", bool: visio}
            ]
        };

        console.log(obj)

        post_obj(obj)
        
      }

      //this function posts the user to /onboard to do all the things need for onboardings
      function post_obj(obj){

        //Create img and replace with table to show that it is working
        img = document.createElement("img");
        img.src = 'images/loading.gif';
        img.className = 'loading';
        img.id = 'root';
        img.alt = 'loading_icon';
        document.getElementById("table_root").replaceWith(img);

        
        //POST to onboard to complete onboardings
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
          if(this.readyState == 4){
            console.log(this.responseText);
            window.alert(this.responseText);
            window.location = "/onboard";
          }else{
            //loading signal icon here
          }
        }
        xhttp.open("POST", "/onboard", true);
        xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhttp.send(JSON.stringify(obj));
      }

      function parse_name(name){
        last_name = name.replace(/ Jr,+/g, '');
        last_name = last_name.replace(/\s/g, '')
        return last_name;
      }
      function parse_email(email){
        true_email = email.replace(/\s/g, '');
        return true_email;
      }
