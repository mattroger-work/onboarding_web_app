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
          date = new Date(obj.fields.DueDate);
          due_date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
          last_name = parse_name(obj.fields.Title);
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
              "<td>" + obj.fields.Personal_x0020_Email + "</td>" +
              "<td>" + obj.fields.Active_x0020_Directory_x0020_Imp + "</td>" +
              "<td>" + obj.fields.IT_x0020_Welcome_x0020_Email_x00 + "</td>" +
              "<td>" + licenses + "</td>" +
              "<td><button onclick=\"onboard('"+licenses+"','"+obj.id+"','"+last_name+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+obj.fields.DueDate+"','"+obj.fields.Personal_x0020_Email+"','"+obj.fields.Active_x0020_Directory_x0020_Imp+"','"+obj.fields.IT_x0020_Welcome_x0020_Email_x00+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        //add the ele and the table footer
        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';
      }

      //create the sub-contractors table
      function Create_sub_Table(table_obj){
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
          due_date = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
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
              "<td><button onclick=\"onboard('"+licenses+"','"+obj.id+"','"+last_name+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+obj.fields.DueDate+"','"+obj.fields.Personal_x0020_Email+"','"+obj.fields.Active_x0020_Directory_x0020_Imp+"','"+obj.fields.IT_x0020_Welcome_x0020_Email_x00+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        //add the ele and the table footer
        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';

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
        
        //POST to onboard to complete onboardings
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
          if(this.readyState == 4){
            //this callback function should reload only the table and not the entire page
            console.log(this.responseText, ()=>{
              var xhttp2 = new XMLHttpRequest();
              xhttp2.onreadystatechange = function(){
                if(this.readyState == 4){
                  data = this.responseText;
                  Create_hq_Table(data);
                }
              }
              xhttp.open("GET", "/onboard/get", true);
              xhttp.send();
            }); 
            //window.location = '/onboard';
          }
        }
        xhttp.open("POST", "/onboard", true);
        xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhttp.send(JSON.stringify(obj));
      }

      function parse_name(name){
        pattern = name.replace(/ Jr,+/g, '');
        return pattern;
      }

      /*
      function change_amount(){
        amount = document.getElementById('amount').value;

        window.location = '/onboard?amount='+ amount;
      }*/