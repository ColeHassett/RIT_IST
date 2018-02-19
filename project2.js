// actions to perform when the document is loaded
// All calls to the myXhr function are checked for success with .done()
$(document).ready(function(){
  // Call to the about section of the api to push information onto the webpage
  myXhr('get',{path:'/about/'},'#about').done(function(json){
      var x="<h2>"+json.title+"</h2>";
      x+="<p>"+json.description+"</p>";
      x+="<p>"+json.quote+"</p>";
      x+="<p style='font-style:italic;font-size:11px;color:orange;'>-"+json.quoteAuthor+"</p>";
      $('#about').html(x);
  });

  // Call to the undergraduate degree section of the api to push the information onto the webpage
  myXhr('get',{path:'/degrees/undergraduate/'},'#content').done(function(json){
    $.each(json.undergraduate,function(i, item){
      $('#contentul').append('<li><a href="#tabs-'+i+'">'+item.title+'</a></li>');
      $('#content').append('<div id="tabs-'+i+'"><h2>Description: </h2><p>'+item.description+'</p><hr/>'+
      '<h2>Concentrations:</h2><ul id="tabsul-'+i+'"></ul></div>');
      // Create the list of concentrations available for the major and add it to the tab
       $.each(item.concentrations, function(j){
        $('#tabsul-'+i+'').append('<li>' + item.concentrations[j] + '</li>');
      });
    });
    // Initialize the tabs on the undergraduate degree section
    // Set the default tab to the left most
    $("#content").tabs({
      active: 0
    });
  });

  // Call to the graduate degree section of the api to push the information onto the page
  myXhr('get',{path:'/degrees/graduate/'},'#graduate').done(function(json){
    $.each(json.graduate,function(i, item){
      // Check to make sure the object is a major and if so pull all info
      if(item.title){
        $('#graduateul').append('<li><a href="#tabsg-'+i+'">'+item.title+'</a></li>');
        $('#graduate').append('<div id="tabsg-'+i+'"><h2>Description: </h2><p>'+item.description+'</p><hr/>'+
        '<h2>Concentrations:</h2><ul id="tabsgul-'+i+'"></ul></div>');
         $.each(item.concentrations, function(j){
          $('#tabsgul-'+i+'').append('<li>' + item.concentrations[j] + '</li>');
        });
      }
      // If the object is the certificates place the info into the certificates section
      else {
        $.each(item.availableCertificates, function(j){
          $('#cert'+j).append('<p>'+item.availableCertificates[j]+'</p>');
        });
      }
    });
    // Initialize the tabs for the graduate section on the left most tab
    $("#graduate").tabs({
      active: 0
    });
  });

  // Call to pull all the information on the IST minors from the api and add it to the page
  myXhr('get',{path:'/minors/UgMinors/'},'#minors').done(function(json){
    var x = '';
    // Iterate over all the minors to be added to the page
    $.each(json.UgMinors,function(i, item){
      x+="<h3>" + item.title + "</h3>";
      x+="<div><h2>Description: </h2><p>"+item.description+"</p><hr/>";
      x+="<h2>Courses: </h2><ul>";
      var minor = item.name
      // Iterate over all the courses to be added to a minors section
      $.each(item.courses, function(j){
       x+= "<li id='"+j+minor+item.courses[j]+"'><a>" + item.courses[j] + "</a></li>";
       //Call to the addclick function for displaying the course information
       addClick(item.courses[j], minor, j);
      });
      x+= "</ul>"
      // Check if the minor has any notes and add them if so
      if (item.note) {
        x+="<hr/><h2>Notes: </h2><p>"+item.note+"</p></div>";
      }
      else {
        x+="</div>";
      }
    });
    $('#minorsacc').append(x);
    // Function to turn the minors section into an accordion style display
    $(function(){
      $('#minorsacc').accordion({
        collapsible: true,
        heightStyle: "content"
      });
    });
  });

  // Call to pull the career introduction information from the api and append it to the page
  myXhr('get',{path:'/employment/introduction/'},'#intro').done(function(json){
    var x = '<h1>' + json.introduction["title"] + '</h1>';
    $.each(json.introduction["content"],function(i, item){
      x+= "<h2>" + item.title + "</h2><p>" + item.description + "</p>";
    });
    $('#intro').append(x);
  });

  // Call to pull the degree statistics information from the api and add it to the page
  myXhr('get',{path:'/employment/degreeStatistics/'},'#degreeStats').done(function(json){
    var x = '<h1>' + json.degreeStatistics["title"] + '</h1>';
    $.each(json.degreeStatistics["statistics"],function(i, item){
      x+= "<div><h2>" + item.value + "</h2><p>" + item.description + "</p></div>";
    });
    $('#degreeStats').append(x);
  });

  // Call to pull the employers information from the api and add it to the page
  myXhr('get',{path:'/employment/employers/'},'#employers').done(function(json){
    var x = '<h1>' + json.employers["title"] + '</h1>';
    $.each(json.employers["employerNames"],function(i, item){
      x+= "<p>" + item + "</p>";
    });
    $('#employers').append(x);
  });

  // Call to pull the careers information from the api and add it to the page
  myXhr('get',{path:'/employment/careers/'},'#careers').done(function(json){
    var x = '<h1>' + json.careers["title"] + '</h1>';
    $.each(json.careers["careerNames"],function(i, item){
      x+= "<p>" + item + "</p>";
    });
    $('#careers').append(x);
  });

  // Call to pull the coop table information for RIT students from the api
  myXhr('get',{path:'/employment/coopTable/'},'#coop').done(function(json){
    var x = "<h2><a class='tablebutton'>" + json.coopTable["title"] + "</a></h2>";
    $('#coop').append(x);
    var table = "<table><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Term</th></tr></thead><tbody'>";
    $.each(json.coopTable["coopInformation"], function(i, item){
      table += "<tr><td>"+item.degree+"</td><td>"+item.employer+"</td><td>"+item.city+"</td><td>"+item.term+"</td></tr>";
    });
    table += "</tbody></table>";
    // Add the click function to the button created
    // Allows for the vex dialog pop up to be show the coop table when pressed
    $(document.getElementById("coop")).click(function() {
      vex.dialog.open({
        message: "Recent Student Coop Jobs: ",
        input: table,
        buttons: {}
      });
    });
  });

  // Call to pull the employment table information for RIT graduates from the api
  myXhr('get',{path:'/employment/employmentTable/'},'#professional').done(function(json){
    var x = "<h2><a class='tablebutton'>" + json.employmentTable["title"] + "</a></h2>";
    $('#professional').append(x);
    var table = "<table><thead><tr><th>Degree</th><th>Employer</th><th>Location</th><th>Title</th><th>Start Date</th></tr></thead><tbody'>";
    $.each(json.employmentTable["professionalEmploymentInformation"], function(i, item){
      table += "<tr><td>"+item.degree+"</td><td>"+item.employer+"</td><td>"+item.city+"</td><td>"+item.title+"</td><td>"+item.startDate+"</td></tr>";
    });
    table += "</tbody></table>";
    // Function to add the click function to each created buttons
    // Allows a vex dialog to be presented with the professional information table
    $(document.getElementById("professional")).click(function() {
      vex.dialog.open({
        message: "Graduating Student Employment: ",
        input: table,
        buttons: {}
      });
    });
  });

  // Call to pull the people information from the people section of the api
  myXhr('get',{path:'/people/'},'#people').done(function(json){
    // Iterating through the faculty portion of the people api
    // Then appends the information to the page and adds a click function to display
    // All information about the faculty
    $.each(json.faculty,function(i, item){
      var x='';
      x+='<li id="'+item.username+'" data-username="'+item.username+'">';
      x+='<h2>'+item.name+'</h2><p>'+item.title+'</p></li>';

      $('#faculty').append(x);

      $(document.getElementById(item.username)).click(function() {
        facultyText ='<img style="height: 100px; margin-left: 15%;" src="'+item.imagePath+'"/>';
        facultyText+='<h2 style="margin-left: 15%;">'+item.name+'</h2><p style="margin-left: 15%;">'+item.title+'</p>';
        facultyText+='<div style="margin-left: 15%;">'+'<p>'+item.office+'</p>'+'<p><a href="'+item.website+'">'+item.website+'</a></p>'+
        '<p>'+item.phone+'</p>'+'<p>'+item.email+'</p></div>';

        vex.dialog.open({
          input: facultyText,
          buttons: {}
        });
      });
    });
    // Iterating through the staff portion of the people api
    // Then appends the infroamtion to the page and adds a click function to display
    // All information about the staff
    $.each(json.staff,function(i, item){
      var x='';
      x+='<li id="'+item.username+'" data-username="'+item.username+'">';
      x+='<h2>'+item.name+'</h2><p>'+item.title+'</p></li>';

      $('#staff').append(x);

      $(document.getElementById(item.username)).click(function() {
        facultyText ='<img style="height: 100px;" src="'+item.imagePath+'"/>';
        facultyText+='<h2>'+item.name+'</h2><p>'+item.title+'</p>';
        facultyText+='<div>'+'<p>'+item.office+'</p>'+'<p><a href="'+item.website+'">'+item.website+'</a></p>'+
        '<p>'+item.phone+'</p>'+'<p>'+item.email+'</p></div>';

        vex.dialog.open({
          input: facultyText,
          buttons: {}
        });
      });
    });
  });

  // Call to pull the research information by interest area from the research section of the api
  myXhr('get',{path:'/research/byInterestArea/'},'#researchInterest').done(function(json){
    var x = '';
    $.each(json.byInterestArea,function(i, item){
      x+="<h2><a class='orangebutton' id='"+item.areaName+"'>" + item.areaName + "</a></h2>";
    });
    $('#researchInterest').append(x);
    //Iterating over all the h2 child elements of the interest area research section
    // Adds a click function to each h2 to allow a pop up to be presented with all citations
    $("#researchInterest").children('h2').each(function(i, item){
      var link = $(this).children('a');
      var id = $(link).attr('id');
      var test = json.byInterestArea.filter(function(data) {
        return data.areaName == id;
      });
      var citationsText = "<ul>";
      $.each(test[0].citations, function(j, item2) {
        citationsText += "<li>"+test[0].citations[j]+"</li>";
      })
      citationsText += "</ul>";
      // The function to add a click action to each element for the vex dialogs
      $(this).click(function() {
        vex.dialog.open({
          message: "Citations for "+id+": ",
          input: citationsText,
          buttons: {}
        });
      });
    });
  });

    // Call to pull the research information by faculty from the research section of the api
    myXhr('get',{path:'/research/byFaculty/'},'#researchFaculty').done(function(json){
      var x = '';
      $.each(json.byFaculty,function(i, item){
        x+="<h2><a class='orangebutton' id='"+item.facultyName+"'>" + item.facultyName + "</a></h2>";
      });
      $('#researchFaculty').append(x);
      // Iterating over all the h2 child elements of the faculty research section
      // Adds a click function to each h2 to allow for a pop up listing all citations
      $("#researchFaculty").children('h2').each(function(i, item){
        var link = $(this).children('a');
        var id = $(link).attr('id');
        var test = json.byFaculty.filter(function(data) {
          return data.facultyName == id;
        });
        var citationsText = "<ul>";
        $.each(test[0].citations, function(j, item2) {
          citationsText += "<li>"+test[0].citations[j]+"</li>";
        })
        citationsText += "</ul>";
        // The function to add a vex dialog on click
        $(this).click(function() {
          vex.dialog.open({
            message: "Citations for "+id+": ",
            input: citationsText,
            buttons: {}
          });
        });
      });
    });

    // Call to pull the resources information from the api into the resources section of the page
    myXhr('get',{path:'/resources/'},'#resources').done(function(json){
      // Study abroad section of information in the api
      var x = '<h1>'+json.title+'</h1><div id="resourcesAcc">';
      x+="<h3>" + json.studyAbroad.title + "</h3>";
      x+="<div><h2>Description</h2><p>"+json.studyAbroad.description+"</p>";
      x+="<h2>Places</h2><ul>";
      // For each to pull all the information from each object
      $.each(json.studyAbroad["places"], function(j, item){
        x+= "<h3>" + item.nameOfPlace + "</h3><p>"+item.description+"</p>";
      });
      x+='</div>';

      // Academic advisors section of information in the api
      x+="<h3>" + json.studentServices.title + "</h3>";
      x+="<div><h2>"+json.studentServices["academicAdvisors"].title+"</h2><p>"+json.studentServices["academicAdvisors"].description+"</p>";
      x+="<a href="+json.studentServices["academicAdvisors"].faq["contentHref"]+"><p>"+json.studentServices["academicAdvisors"].faq["title"]+"</p></a>";

      // Professional advisors section of information in the api
      x+="<h2>"+json.studentServices["professonalAdvisors"].title+"</h2>";
      $.each(json.studentServices["professonalAdvisors"].advisorInformation, function(j, item){
        x+= "<p>"+item.name+ "("+item.email+"): " + item.department+"</p>";
      });

      // Faculty advisors section of information in the api
      x+="<h2>"+json.studentServices["facultyAdvisors"].title+"</h2><p>"+json.studentServices["facultyAdvisors"].description+"</p>";

      // IST minor advising section of the api
      x+="<h2>"+json.studentServices["istMinorAdvising"].title+"</h2>";
      $.each(json.studentServices["istMinorAdvising"].minorAdvisorInformation, function(j, item){
        x+= "<p>"+item.advisor+ "("+item.email+"): " + item.title+"</p>";
      });
      x+='</div>';

      // Tutoring and Lab info from the api
      x+="<h3>" + json.tutorsAndLabInformation.title + "</h3>";
      x+="<div><p>"+json.tutorsAndLabInformation.description+"</p></div>";

      // Student ambassadors information from the api
      x+="<h3>" + json.studentAmbassadors.title + "</h3>";
      x+="<div><img src='"+json.studentAmbassadors.ambassadorsImageSource+"'>";
      $.each(json.studentAmbassadors["subSectionContent"], function(j, item){
        x+= "<h2>"+item.title+"</h2><p>"+item.description+"</p>";
      });
      x+="<a href='"+json.studentAmbassadors.applicationFormLink+"'><p>Application</p></a><p>"+json.studentAmbassadors.note+"</p></div>";

      // Section for all the forms available from the forms section of the api
      x+="<h3>Forms</h3><div><h2>Graduate</h2>";
      $.each(json.forms["graduateForms"], function(j, item){
        x+= "<a href='http://www.ist.rit.edu/"+item.href+"'><p>"+item.formName+"</p></a>";
      });
      x+="<h2>Undergraduate</h2><a href='http://www.ist.rit.edu/"+json.forms["undergraduateForms"][0].href+"'><p>"+json.forms["undergraduateForms"][0].formName+"</p></a></div>";

      // Information about coop enrollment from the api
      x+="<h3>"+json.coopEnrollment.title+"</h3><div>";
      $.each(json.coopEnrollment["enrollmentInformationContent"], function(j, item){
        x+= "<h2>"+item.title+"</h2><p>"+item.description+"</p>";
      });
      x+= "<a href='"+json.coopEnrollment.RITJobZoneGuidelink+"'><p>RIT Job Zone Guide</p></a></div>"
      x+='</div>';
      $('#resources').append(x);

      // Function to add the accordion from jquery ui to all resources information
      $(function(){
        $('#resourcesAcc').accordion({
          collapsible: true,
          heightStyle: "content"
        });
      });
    });

    // Call to the social portion of the api to add the information to the social section of the page
    myXhr('get',{path:'/footer/social/'},'#social').done(function(json){
      var x = '<h1>' + json.social["title"] + '</h1>';
      x += '<h2>' + json.social["tweet"] + '</h2>';
      x += '<p>' + json.social["by"] + '</p>';
      x += '<a href="'+json.social["twitter"]+'"><img src="twitter.png"></a>';
      x += '<a href="'+json.social["facebook"]+'"><img src="facebook.png"></a>';
      $('#social').append(x);
    });

    // Call to add the quick links from the api to the quick links section of the page
    myXhr('get',{path:'/footer/quickLinks/'},'#quickLinks').done(function(json){
      var x = '';
      // for each loop to pull each objects information
      $.each(json.quickLinks, function(i, item) {
        x+= '<h3><a href="'+item.href+'">'+item.title+'</a></h3>'
      })
      $('#quickLinks').append(x);
    });

    // Call to add the copywright information from the api to the copywright section of the page
    myXhr('get',{path:'/footer/copyright/'},'#copyright').done(function(json){
      $('#copyright').append(json.copyright["html"]);
    });

    // Call to print the recent news information from the api to the news section on the page
    myXhr('get',{path:'/news/year/'},'#news').done(function(json){
      var x = '<h2 id="recentNews" class="tablebutton">Recent News</h2>';
      $('#news').append(x);
      // Foreach loop to pull each objects information
      var newsItems = "";
      $.each(json.year, function(i, item){
        newsItems+= "<h2>" + item.title + "</h2><h3>" + item.date.substring(0, 9) + "</h3><p>"+item.description+"</p>";
      });
      $("#recentNews").click(function() {
        vex.dialog.open({
          message: "Recent News: ",
          input: newsItems,
          buttons: {}
        });
      });
    });

    // Call to print the older news information from the api to the news section on the page
    myXhr('get',{path:'/news/older/'},'#news').done(function(json){
      var x = '<h2 id="olderNews" class="tablebutton">Older News</h2>';
      $('#news').append(x);
      // Foreach loop to pull each objects information
      var newsItems = "";
      $.each(json.older, function(i, item){
        newsItems+= "<h2>" + item.title + "</h2><h3>" + item.date.substring(0, 9) + "</h3><p>"+item.description+"</p>";
      });
      $("#olderNews").click(function() {
        vex.dialog.open({
          message: "Older News: ",
          input: newsItems,
          buttons: {}
        });
      });
    });

    // myXhtml('get',{path:'/contactForm/'},'#contact').done(function(json){
    //   console.log(this);
    //   $("#contact").load(this);
    // });

    // Using bigSlide plugin to make the hidden menus appear when their button is selected
    $('.menu-link').bigSlide();

    // Using sticky plugin to make the buttons stick to the screen even when scrolling
    $("#navButton").sticky({
      topSpacing:50
    });

});

///////////////////////////////////////////////////
//utilities...
//data - {path:'/about/'}
//(getOrPost, data, idForSpinner)
//function to pull data from the api using the proxy
function myXhr(t, d, id){
  return $.ajax({
    type:t,
    url:'proxy.php',
    dataType:'json',
    data:d,
    cache:false,
    async:true,
    beforeSend:function(){
    }
    //what the program will do every time it is called
  }).always(function(){
    //What the method will do when it fails to query using the proxy
  }).fail(function(a, b, c){
    console.log(a+", "+b+", "+c);
  });
}

function myXhtml(t, d, id){
  return $.ajax({
    type:t,
    url:'proxy.php',
    dataType:'html',
    data:d,
    cache:false,
    async:true,
    beforeSend:function(){
    }
    //what the program will do every time it is called
  }).always(function(){
    //What the method will do when it fails to query using the proxy
  }).fail(function(a, b, c){
    console.log(a+", "+b+", "+c);
  });
}

// Function to add a click function to the courses listed within each minor
function addClick(course, minor, id) {
  myXhr('get', {path: '/course/courseID='+course+'/'}, '#minors').done(function(json) {
    var courseText = "<h2>"+json.title+"</h2><p>"+json.description+"</p>";
    $('#'+id+minor+course+'').click(function() {
      vex.dialog.open({
        input: courseText,
        buttons: {}
      });
    });
  });
}
