(function()
 {
     var body = document.body;
     var width = body.clientWidth;
     var height = body.clientHeight;

     var overlay = document.createElement('div');
     overlay.style.position = 'absolute';
     overlay.style.left = '0px';
     overlay.style.top = '0px';
     overlay.style['background-color'] = 'rgba(0,0,0,0)';
     overlay.style.width = width+'px';
     overlay.style.height = height+'px';

     body.appendChild(overlay);

     var yes = document.getElementById('rdoDestroyYes').parentElement;
     var no = document.getElementById('rdoDestroyNo').parentElement;
     var partnerNo = document.getElementById('rdoWillDestroyNo').parentElement;
     var partnerYes = document.getElementById('rdoWillDestroyYes').parentElement;
     var btnSubmit = document.getElementById('btnSubmit').parentElement;
     var progress = document.getElementById('progbar');

     function step1()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('In this first example we will chose to pay 10p to reduce our partner\'s payout by 50p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step2();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = yes.offsetTop+'px';
	 yes.style.border = '2px solid red';
	 yes.children[0].click();

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');

     }

     function step2()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('Now we need to select what we believe our partner will do. This does not affect the amount we or our partner will be paid.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step3();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = partnerNo.offsetTop+'px';
	 partnerNo.style.border = '2px solid red';
	 partnerNo.children[0].click();

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }

     function step3()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('The last step of a decision is to click to go to their next pairing.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       btnSubmit.style.border = '';
				       yes.style.border = '';
				       yes.children[0].checked = false;
				       partnerNo.style.border = '';
				       partnerNo.children[0].checked = false;
				       step4();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
 	 instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px';
	 instruction.style.top = btnSubmit.offsetTop+'px';
	 btnSubmit.style.border = '2px solid red';

	 jQuery(window).resize(e => instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px');
     }

     function step4()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('Our partner decided, as we did, to pay 10p to destroy 50p of our payment. Our current payout is 100p - 10p (our decision) - 50p (our partner\'s decision), which totals 40p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step5();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = progress.offsetTop+'px';
	 progress['aria-valuenow'] = 1;
	 progress.style.width = '10%'
	 progress.children[0].innerHTML = 'Partner number: 2 of 10';

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }

     function step5()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('For our second decision we choose to not pay the 10p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step6();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = no.offsetTop+'px';
	 no.style.border = '2px solid red';
	 no.children[0].click();

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }

     function step6()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('As before we make a prediction about what our partner will do and then continue on to the next round.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       btnSubmit.style.border = '';
				       no.style.border = '';
				       no.children[0].checked = false;
				       partnerYes.style.border = '';
				       partnerYes.children[0].checked = false;
				       step7();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
 	 instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px';
	 instruction.style.top = btnSubmit.offsetTop+'px';
	 btnSubmit.style.border = '2px solid red';
	 partnerYes.children[0].click();
	 partnerYes.style.border = '2px solid red';

	 jQuery(window).resize(e => instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px');
     }

     function step7()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('Our payout for the last round was the full 100p as we didn\'t pay 10p to reduce our partner\'s payout and they didn\'t pay to reduce ours. That gives us a running total of 140p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step8();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = progress.offsetTop+'px';
	 progress.style.width = '20%'
	 progress.children[0].innerHTML = 'Partner number: 3 of 10';

 	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }

     function step8()
     {	 
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('In this round we have chosen to pay 10p to reduce our partner\'s payout by 50p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       yes.children[0].checked = false;
				       yes.style.border = '';
				       btnSubmit.style.border = '';
				       partnerYes.children[0].checked = false;
				       partnerYes.style.border = '';
				       step9();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
 	 instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px';
	 instruction.style.top = btnSubmit.offsetTop+'px';
	 yes.children[0].click();
	 yes.style.border = '2px solid red';
	 btnSubmit.style.border = '2px solid red';
	 partnerYes.children[0].click();
	 partnerYes.style.border = '2px solid red';

	 jQuery(window).resize(e => instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px');
     }

     function step9()
     {	 
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('We paid 10p so our partner\'s  payout would be reduced by 50p. Our partner decided not to pay 10p, which means our payout for the last round was 90p, with a running total of 230p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       step10();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = progress.offsetTop+'px';
	 progress.style.width = '30%'
	 progress.children[0].innerHTML = 'Partner number: 4 of 10';

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }

     function step10()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('In this final round of the tutorial we have chosen not to pay 10p, so our partner\'s income is not affected by us.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Continue');
	 nextLink.appendChild(linkText);
	 nextLink.style.cursor = 'pointer';
 	 nextLink.addEventListener('click', function(e)
				   {
				       e.preventDefault();
				       body.removeChild(instruction);
				       no.children[0].checked = false;
				       no.style.border = '';
				       btnSubmit.style.border = '';
				       partnerNo.children[0].checked = false;
				       partnerNo.style.border = '';
				       step11();
				   });
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
 	 instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px';
	 instruction.style.top = btnSubmit.offsetTop+'px';
	 no.children[0].click();
	 no.style.border = '2px solid red';
	 btnSubmit.style.border = '2px solid red';
	 partnerNo.children[0].click();
	 partnerNo.style.border = '2px solid red';

	 jQuery(window).resize(e => instruction.style.left = ((jQuery('#btnSubmit')[0].parentElement.offsetLeft + jQuery('.col-md-3')[0].clientWidth) - instruction.clientWidth) + 'px');
     }

     function step11()
     {
	 var instruction = document.createElement('p');
	 instruction.className = 'well';
	 instruction.style.position = 'absolute';
	 instruction.style.width = '10%';
	 var insText = document.createTextNode('We did not pay 10p so our partner\'s payout will not be reduced by us. Our partner decided to pay 10p, which means our payout for the last round was 50p, with a running total of 280p.');
	 instruction.appendChild(insText);
	 instruction.appendChild(document.createElement('br'));
	 var nextLink = document.createElement('a');
	 var linkText = document.createTextNode('Click To Start The Experiment');
	 nextLink.appendChild(linkText);
	 nextLink.setAttribute('href', '/experiment/main');
	 instruction.appendChild(nextLink);
	 body.appendChild(instruction);
	 instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px';
	 instruction.style.top = progress.offsetTop+'px';
	 progress.style.width = '40%'
	 progress.children[0].innerHTML = 'Partner number: 5 of 10';

	 jQuery(window).resize(e => instruction.style.left = (jQuery('.col-md-3')[0].clientWidth - instruction.clientWidth) + 'px');
     }
     
     step1();
 })();
