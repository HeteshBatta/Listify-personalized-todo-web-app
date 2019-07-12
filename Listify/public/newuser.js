var createbtn = document.getElementById('createaccount');
var username = document.getElementById('usernameipt');
var password = document.getElementById('passipt');
var email = document.getElementById('emailipt');
var dob = document.getElementById('dobipt');
var dd = document.getElementById('gender');
var x , v;
var datevalue , gendervalue="Male";
dd.addEventListener("change" , function(abc)
{
  x = dd.selectedIndex;
  v = document.getElementsByClassName("c1")[x];
  gendervalue = v.value;
})

createbtn.addEventListener("click" , function(abc)
{
  if(username.value=="" || password.value=="" || email.value=="" || dob.value=="")
  {
     showWarning();
     return
  }
  var req = new XMLHttpRequest();
  req.addEventListener("load" , function(abc)
  {
       document.getElementById('confirmbtn').click();
  })
  req.open('POST', '/addnewUser');
  req.setRequestHeader("Content-Type" , "application/json");
  req.send(JSON.stringify({'username' : username.value , 'password' : password.value , 'gender' : gendervalue , 'dob' : dob.value , 'email' : email.value}));
})

function showWarning()
{
  var warning = document.getElementById('warning');
  warning.style.display="block";
}
