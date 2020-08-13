function Create_hq_Table_hr(table_obj){

    var element = '';
        //table head
        table_head = 
        '<table id="table_root" class="table">' +
        '<thead class="thead-light">' +
          '<th scope="col">First Name</th>' +
          '<th scope="col">Last Name</th>' +
          '<th scope="col">Start Date</th>' +
          '<th scope="col">Personal Email</th>' +
          '<th scope="col">Welcome Letter</th>' +
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
          //months start a 0
          month = date.getMonth() < 12 ? date.getMonth() + 1 : 1;
          due_date = month +'/'+ date.getDate() +'/'+ date.getFullYear();
          last_name = parse_name(obj.fields.Title);
          per_email = parse_email(obj.fields.Personal_x0020_Email);
          welcome_email = obj.fields.Welcome_x0020_Email_x0020_Sent ? obj.fields.Welcome_x0020_Email_x0020_Sent : "False";
          element += (
            "<tr>" +
              "<td>" + obj.fields.Employee_x0020_Name_x0020_First + "</td>" +
              "<td>" + last_name + "</td>" +
              "<td>" + due_date + "</td>" +
              "<td>" + per_email + "</td>" +
              "<td>" + welcome_email + "</td>" +
              "<td><button onclick=\"onboard_hr('"+obj.id+"','"+last_name+"','"+obj.fields.Employee_x0020_Name_x0020_First+"','"+obj.fields.DueDate+"','"+per_email+"')\">ONBOARD</button></td>" +
            "</tr>"
          );
        });

        //add the ele and the table footer
        document.getElementById("table_root").innerHTML += element + '  </tbody> </table>';

}

function onboard_hr(id, last_name, first_name, due_date, per_email){
    obj = {
        "id": id,
        "first_name":first_name,
        "last_name":last_name,
        "due_date":due_date,
        "per_email":per_email
      };

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
          console.log(this.responseText);
          window.alert(this.responseText);
          window.location = "/hr";
        }else{
          //loading signal icon here
        }
      }
      xhttp.open("POST", "/hr", true);
      xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhttp.send(JSON.stringify(obj));
}