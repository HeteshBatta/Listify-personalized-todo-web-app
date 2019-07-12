var username = document.getElementById('usernameipt');
var password = document.getElementById('passwordipt');
var loginbtn = document.getElementById('Loginbtn');
var createbtn = document.getElementById('Createbtn');


loginbtn.addEventListener("click" , function(abc)
{
  console.log("!");
  if(username.value=="" || password.value=="")
  {
    displaywarning();
    return
  }
  getlogindetails();
})

function getlogindetails()
{
  var request = new XMLHttpRequest();
  request.addEventListener('load', function()
{
  var rest = JSON.parse(request.responseText);
  console.log(request.responseText);
  if(rest && rest.length)
  {
     if(rest[0].username==username.value && rest[0].password==password.value)
     {
       window.location.href="http://localhost:8000/todoPage";
     }
     else {
       displaywarning1();
     }
  }
  else
  {
     console.log("Warning 2 fired");
     displaywarning1();
  }
});
  request.open('POST', '/search');
  request.setRequestHeader("Content-Type" , "application/json");
  request.send(JSON.stringify({'username' : username.value , 'password' : password.value}));
}

createbtn.addEventListener("click" , function(abc)
{
  window.location.href="http://localhost:8000/CreateAccount";
})

function displaywarning()
{
  var warning1 = document.getElementById('warning');
  warning1.style.display = "none";
  var warning = document.getElementById('warning1');
  warning.style.display = "block";
}

function displaywarning1()
{
  var warning1 = document.getElementById('warning1');
  warning1.style.display = "none";
  var warning = document.getElementById('warning');
  warning.style.display = "block";
}
