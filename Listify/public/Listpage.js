var btn = document.getElementById('addtask');
var ipt = document.getElementById('ipt');
var welcome = document.getElementById('welcome');
var img = document.getElementById('img')
var p = document.getElementById('pdetails');
var list = document.getElementById('list');
var fortask = document.getElementById('fortasks');
var logout = document.getElementById('logoutspan');
getnameandimage();
createlist();
var data = [];
btn.addEventListener("click" , function(abc)
{
  var req = new XMLHttpRequest();
  req.addEventListener("load" , function(abc)
  {
    window.location.reload(true);
  })
  req.open('POST', '/addnewTask');
  req.setRequestHeader("Content-Type" , "application/json");
  req.send(JSON.stringify({'task' : ipt.value}));
})

function getnameandimage()
{
  var xhttp = new XMLHttpRequest();
  xhttp.addEventListener("load" , function()
  {
      data = JSON.parse(xhttp.responseText);
      console.log(data);
      // welcome.innerHTML = "Welcome, " + data[0].username;
      img.setAttribute("src" , "uploads/"+data[0].photopath);
      p.innerHTML = "Username : " + data[0].username + "<hr></hr>" + "Email : " + data[0].email + "<hr></hr>" + "Date Of Birth : "
      +data[0].dob + "<hr></hr>" + "Gender : " + data[0].gender;
  })
  xhttp.open("GET", "/getnameandimage");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}

function createlist()
{
  var xhttp = new XMLHttpRequest();
  xhttp.addEventListener("load" , function()
  {
      data = JSON.parse(xhttp.responseText);
      var i=0;
      console.log(data);
      while(i<data[0].taskstobedone.length)
      {
        var div = document.createElement('div');
        div.setAttribute('class' , 'listitemdiv');
        div.setAttribute('id' , 'div'+i);
        var radiobtn = document.createElement('input');
        radiobtn.setAttribute('type' , 'radio');
        radiobtn.setAttribute('class' , 'listitembtn');
        radiobtn.setAttribute('id' , 'btn'+i);
        radiobtn.addEventListener("click" , function(abc)
      {
        var text = abc.target.nextSibling.innerHTML;
        abc.target.parentElement.setAttribute("class" , "clicked");
        var cut = document.createElement('strike');
        cut.innerHTML = abc.target.nextSibling.innerHTML;
        abc.target.nextSibling.innerHTML = "";
        abc.target.nextSibling.setAttribute("style" , "color:grey")
        abc.target.nextSibling.appendChild(cut);
        var xhttp1 = new XMLHttpRequest();
        xhttp1.addEventListener("load" , function()
        {
        })
        xhttp1.open('POST', '/deletefromarray');
        xhttp1.setRequestHeader("Content-Type" , "application/json");
        xhttp1.send(JSON.stringify({'text' : text}));
      })
        var p = document.createElement('p');
        p.innerHTML = data[0].taskstobedone[i];
        p.setAttribute('class' , 'listitem');
        p.setAttribute('id' , 'p'+i);
        var hr = document.createElement('hr');
        hr.setAttribute('class' , 'hr');
        hr.setAttribute('id' , 'div'+i);
        i++;
        div.appendChild(radiobtn);
        div.appendChild(p);
        div.appendChild(hr);
        list.appendChild(div);
      }
      var h = (i*50)+250;
      fortask.setAttribute('style' , 'height : '+h+'px')
  })
  xhttp.open("GET", "/getnameandimage");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send();
}
