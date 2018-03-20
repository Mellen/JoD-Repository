(function()
 {
     var questionID = 1;
     var maxID = 10;

     function getNextQuesiton()
     {
	 var xhr = new XMLHttpRequest();
	 xhr.open('GET', '/experiment/consentQuestion/'+questionID);

	 xhr.addEventListener('load', function()
			      {
				  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
				  {
				      var consentDiv = document.getElementById('consent');
				      consentDiv.innerHTML += xhr.responseText;
				      window.scrollTo(0,document.body.scrollHeight);
				      var agree = document.getElementById('btnAgree'+questionID);
				      if(agree == null)
				      {
					  agree = document.getElementById('btnAgree'+(questionID+1));
					  questionID++;
				      }
				      agree.addEventListener('click', function()
							    {
								if(questionID == maxID)
								{
								    var btnSign = document.getElementById('btnSign');
								    if(!btnSign)
								    {
									drawSignature();
								    }
								}
								else
								{
								    questionID++;
								    getNextQuesiton();
								}
								this.disabled = true;
							    });
				  }
			      });

	 xhr.send();
     }

     var prolificImage = document.getElementById('prolificImage');

     if(prolificImage != null)
     {	 
	 prolificImage.width = prolificImage.parentElement.clientWidth - 10;
     }
     
     getNextQuesiton();

     function drawSignature()
     {
	 var consentDiv = document.getElementById('consent');
	 
	 var controlsRow = document.createElement('div');
	 controlsRow.className = 'row'

	 var controlsLeftPad = document.createElement('div');
	 controlsLeftPad.className = 'col-md-3';

	 controlsRow.appendChild(controlsLeftPad);
	 
	 var controls = document.createElement('div');
	 controls.className = 'col-md-6';

	 var instruction = document.createElement('p');
	 instruction.innerHTML = 'Click below to get started.';
	 controls.appendChild(instruction);
	 
	 var btnSign = document.createElement('input');
	 btnSign.type = 'button';
	 btnSign.id = 'btnSign';
	 btnSign.value = 'Consent to the study';
	 btnSign.className = "btn btn-success";

	 controls.appendChild(btnSign);

	 controlsRow.appendChild(controls);

	 var controlsRightPad = document.createElement('div');
	 controlsRightPad.className = 'col-md-3';
	 controlsRow.appendChild(controlsRightPad);
	 
	 consentDiv.appendChild(controlsRow);

	 btnSign.addEventListener('click', function()
				  {
				      var xhr = new XMLHttpRequest();

				      xhr.open('POST', 'consent', true);

				      xhr.addEventListener('load', function()
							   {
							       if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
							       {
								   var o = JSON.parse(xhr.responseText);
								   if(o.msg === 'got your consent')
								   {
								       window.location = 'tutorial';
								   }
							       }
							   });

				      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				      var csrftoken = utils.getCookie('csrftoken');

				      xhr.setRequestHeader("X-CSRFToken", csrftoken);

				      xhr.send();
				  });
	 window.scrollTo(0,document.body.scrollHeight);
     }
 })();
