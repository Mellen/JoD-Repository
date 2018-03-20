(function()
 {
     var loading = false;
     var btnDone = document.getElementById('btnDone');
     var limesurveyURL = '';
     
     btnDone.addEventListener('click', function()
			      {
				  window.location.href = limesurveyURL;
			      });

     var dd = document.getElementById('divDone');
     dd.className = 'hidden';     

     var dragging = false;
     var expectedOffsetWitdh = 780;
     var xOffsetMultiplier = 20;
     var maxID = 6;
     var questionID = 1;
     var currentAnswer = {you: null, them: null};
     var currentOptions = {id:'', you_options:[], them_options:[]};
     
     var progressBar = document.getElementById('progressBar');
     progressBar.setAttribute('aria-valuenow', 0);
     progressBar.setAttribute('aria-valuemax', maxID);

     var progressText = document.getElementById('progressText');
     progressText.innerHTML = 'Item number: 0 of '+maxID;
     
     document.getElementById('resultChart').width = document.getElementById('resultChart').parentElement.clientWidth;
     document.getElementById('resultChart').height = document.getElementById('resultChart').parentElement.clientHeight;
     
     document.getElementById('questionSlider').addEventListener('mousedown', function(e)
								{
								    var xOffset = (this.offsetWidth / expectedOffsetWitdh) * xOffsetMultiplier;
								    var x = e.offsetX;
								    if(x < this.width && x >= 0)
								    {
									if(x > this.width - xOffset)
									{
									    x = this.width - xOffset;
									}

									if(x < xOffset)
									{
									    x = xOffset;
									}

									var index = xValueToIndex(x, this.width, currentOptions.them_options.length)
									currentAnswer.you = currentOptions.you_options[index];
									currentAnswer.them = currentOptions.them_options[index];
									dragging = true;
									drawSlider(x);
									setTableValues();
									drawChart();
								    }
								});

     
     document.getElementById('questionSlider').addEventListener('mousemove', function(e)
								{
								    var xOffset = (this.offsetWidth / expectedOffsetWitdh) * xOffsetMultiplier;
								    var x = e.offsetX;
								    if(dragging && x <= this.width - xOffset && x >= xOffset)
								    {
									if(x > this.width - xOffset)
									{
									    x = this.width - xOffset;
									}

									if(x < xOffset)
									{
									    x = xOffset;
									}
									var index = xValueToIndex(x, this.width, currentOptions.them_options.length);
									currentAnswer.you = currentOptions.you_options[index];
									currentAnswer.them = currentOptions.them_options[index];
									drawSlider(x);
									setTableValues();
									drawChart();
								    }
								});

     document.getElementById('questionSlider').addEventListener('mouseup', function(e)
								{
								    dragging = false;
								});     


     document.getElementById('questionSlider').addEventListener('mouseout', function(e)
								{
								    var xOffset = (this.offsetWidth / expectedOffsetWitdh) * xOffsetMultiplier;
								    if(dragging)
								    {
									var x = e.offsetX;
									if(x <= 0)
									{
									    x = xOffset;
									}

									if(x >= this.width)
									{
									    x = this.width - xOffset;
									}

									var index = xValueToIndex(x, this.width, currentOptions.them_options.length);
									currentAnswer.you = currentOptions.you_options[index];
									currentAnswer.them = currentOptions.them_options[index];
									drawSlider(x);
									setTableValues();
									drawChart();
								    }
								    dragging = false;
								});     
     
     
     document.getElementById('btnAccept')
	 .addEventListener('click', function()
			   {
			       if(currentAnswer.you != null && currentAnswer.them != null)
			       {
				   loading = true;
				   sendAnswer();
				   if(questionID == maxID)
				   {
				       var dd = document.getElementById('divDone');
				       dd.className = '';
				       document.getElementById('btnAccept').setAttribute('disabled', true);
				       questionID++;
				       setProgressBar();
				   }
				   else
				   {
				       var instructionsLink = document.getElementById('instructionsLink');
				       if(instructionsLink.className.indexOf("collapsed") == -1)
				       {
					   instructionsLink.click();
				       }

				       questionID++;
				       getNextQuesiton();
				   }
			       }
			   });

     function getNextQuesiton()
     {
	 var xhr = new XMLHttpRequest();
	 xhr.open('GET', '/experiment/svoQuestion/'+questionID);

	 xhr.addEventListener('load', function()
			      {
				  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
				  {
				      loading = false;
				      currentOptions = JSON.parse(xhr.responseText);
				      //I know I shouldn't hard code 4, but I'm tired of dividing by 2 and rounding
				      currentAnswer.you = currentOptions.you_options[4];
				      currentAnswer.them = currentOptions.them_options[4];
				      drawSlider(document.getElementById('questionSlider').width/2);
				      setTableValues();
				      drawChart();
				      setProgressBar();
				  }
				  else
				  {
				      console.log('The XHR has not returned correctly when getting the next SVO question.');
				  }
			      });

	 xhr.send();
     }

     function setProgressBar()
     {
	 progressText.innerHTML = 'Item number: ' + questionID + ' of ' + maxID;
	 progressBar.setAttribute('aria-valuenow', questionID);
	 progressBar.setAttribute('style', 'width:'+(((questionID-1)/maxID)*100)+'%;');
     }

     function setTableValues()
     {
	 var you = document.getElementById('tdYou');
	 var them = document.getElementById('tdThem');

	 you.innerHTML = currentAnswer.you;
	 them.innerHTML = currentAnswer.them;
     }

     function drawChart()
     {
	 var canv = document.getElementById('resultChart');
	 var ctx = canv.getContext('2d');

	 var width = canv.width;
	 var height = canv.height;

	 ctx.clearRect(0, 0, width, height);
	 ctx.font = '20pt Arial';

	 ctx.fillStyle = '#CBCBCB';

	 var offset0 = ctx.measureText('0').width+3;
	 var offset100 = ctx.measureText('100').width+3;

	 ctx.fillText('0', 0, height/2 + 10);
	 ctx.fillText('100', width - offset100, height/2 + 10);
	 
	 ctx.strokeStyle = '#CBCBCB';
	 ctx.lineWidth = 3;
	 ctx.beginPath();
	 ctx.moveTo(offset0, height/2);
	 ctx.lineTo(width - offset100, height/2);
	 ctx.closePath();
	 ctx.stroke();

	 var maxWidth = width - (offset100 + offset0);

	 var youPercent = currentAnswer.you / 100;
	 
	 ctx.strokeStyle = '#0047AB';
	 ctx.lineWidth = 30;
	 ctx.beginPath();
	 ctx.moveTo(offset0, height/2 - (ctx.lineWidth + 5));
	 ctx.lineTo(offset0 + (maxWidth * youPercent), height/2 - (ctx.lineWidth + 5));
	 ctx.closePath();
	 ctx.stroke();

	 var themPercent = currentAnswer.them / 100;
	 
	 ctx.beginPath();
	 ctx.moveTo(offset0, height/2 + (ctx.lineWidth + 5));
	 ctx.lineTo(offset0 + (maxWidth * themPercent), height/2 + (ctx.lineWidth + 5));
	 ctx.closePath();
	 ctx.stroke();

     }
     
     function drawSlider(currentPosition)
     {
	 var canv = document.getElementById('questionSlider');
	 var xOffset = (canv.offsetWidth / expectedOffsetWitdh) * xOffsetMultiplier;
	 var ctx = canv.getContext('2d');

	 var radius = 14;
	 
	 ctx.clearRect(0, 0, canv.width, canv.height);
	 
	 ctx.strokeStyle = '#000000';
	 ctx.lineWidth = 6;
	 ctx.beginPath();
	 ctx.arc(xOffset, canv.height/2, radius, 0, Math.PI * 2, true);
	 ctx.lineTo(canv.width - (xOffset + radius), canv.height/2);
	 ctx.moveTo(canv.width - (xOffset - radius), canv.height/2);
	 ctx.arc(canv.width - xOffset, canv.height/2, radius, 0, Math.PI * 2, false);
	 ctx.closePath();
	 ctx.stroke();

	 ctx.fillStyle = '#ff0000';
	 ctx.beginPath();
	 ctx.arc(currentPosition, canv.height/2, radius, 0, Math.PI * 2, true);
	 ctx.closePath();
	 ctx.fill();

	 ctx.font = '20pt Arial';

	 ctx.fillStyle = '#CBCBCB';

	 var offsetThem = ctx.measureText(currentOptions.them_options[0]).width/2;
	 ctx.fillText(currentOptions.them_options[0], offsetThem - xOffset/2, canv.height/2 + 38);
	 offsetThem = ctx.measureText(currentOptions.them_options[currentOptions.them_options.length-1]).width/2;
	 ctx.fillText(currentOptions.them_options[currentOptions.them_options.length-1], canv.width - (xOffset + offsetThem), canv.height/2 + 38);

	 var offsetYou = ctx.measureText(currentOptions.you_options[0]).width/2;
	 ctx.fillText(currentOptions.you_options[0], offsetYou - xOffset/2, canv.height/2 - 18);
	 offsetYou = ctx.measureText(currentOptions.you_options[currentOptions.you_options.length-1]).width/2;
	 ctx.fillText(currentOptions.you_options[currentOptions.you_options.length-1], canv.width - (xOffset + offsetYou), canv.height/2 - 18);
	 
	 ctx.fillStyle = '#000000';
	 offsetThem = ctx.measureText(currentAnswer.them).width/2;
	 ctx.fillText(currentAnswer.them, currentPosition - offsetThem, canv.height/2 + 38);
	 offsetYou = ctx.measureText(currentAnswer.you).width/2;
	 ctx.fillText(currentAnswer.you, currentPosition - offsetYou, canv.height/2 - 18);

	 ctx.fillText('You receive', 0, canv.height/2 - 56);
	 ctx.fillText('They receive', 0, canv.height/2 + 66);
     }

     function xValueToIndex(x, width, optionCount)
     {
	 var index = 0;

	 var portion = width/(optionCount - 1);

	 index = Math.round(x/portion);
	 
	 return index;
     }
     
     function getLimesurveyURL()
     {
	 var xhr = new XMLHttpRequest();
	 xhr.open('GET', 'experiment/settings/limesurveyURL');
	 xhr.addEventListener('load', function()
			      {
				  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
				  {
				      var result = JSON.parse(xhr.responseText);
				      
				      limesurveyURL = result.value + partid;
				  }
			      });
	 xhr.send();
     }

     function sendAnswer()
     {
	 var xhr = new XMLHttpRequest();
	 xhr.open('POST', '/experiment/svoAnswer/'+questionID+'/'+currentAnswer.you+'/'+currentAnswer.them);

	 xhr.addEventListener('load', function()
			      {
				  if(loading)
				  {
				      currentAnswer.you = null;
				      currentAnswer.them = null;
				  }
			      });

	 xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	 var csrftoken = utils.getCookie('csrftoken');

	 xhr.setRequestHeader("X-CSRFToken", csrftoken);

	 xhr.send()
     }

     getNextQuesiton();
     getLimesurveyURL();
 })();
