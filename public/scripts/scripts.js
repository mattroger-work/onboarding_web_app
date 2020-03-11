
      function CreateTable(table_obj){
        var element = '';
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

        document.getElementById("table_root").innerHTML = table_head;
        
       JSON.parse(table_obj).forEach(obj => {
         if(obj.fields.Licenses_x0020_Needed0){
           licenses = obj.fields.Licenses_x0020_Needed0;
         }else{
           licenses = false;
         }
          element += (
            "<tr>" +
              "<td>" + obj.fields.Employee_x0020_Name_x0020_First + "</td>" +
              "<td>" + obj.fields.Title + "</td>" +
              "<td>" + obj.fields.DueDate + "</td>" +
              "<td>" + obj.fields.Personal_x0020_Email + "</td>" +
              "<td>" + obj.fields.Active_x0020_Directory_x0020_Imp + "</td>" +
              "<td>" + obj.fields.IT_x0020_Welcome_x0020_Email_x00 + "</td>" +
              "<td>" + licenses + "</td>" +
              "<td><button onclick=\"onboard('"+licenses+"','"+obj.id+"','"+obj.fields.Title+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+obj.fields.DueDate+"','"+obj.fields.Personal_x0020_Email+"','"+obj.fields.Active_x0020_Directory_x0020_Imp+"','"+obj.fields.IT_x0020_Welcome_x0020_Email_x00+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';
      }

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

      function post_obj(obj){
        
        //POST to onboard to complete onboardings
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
          if(this.readyState == 4){
            console.log(this.responseText);
            console.log(this.status);
            window.location = '/onboard';
          }
        }
        xhttp.open("POST", "/onboard", true);
        xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhttp.send(JSON.stringify(obj));
      }

      /*
      function change_amount(){
        amount = document.getElementById('amount').value;

        window.location = '/onboard?amount='+ amount;
      }*/