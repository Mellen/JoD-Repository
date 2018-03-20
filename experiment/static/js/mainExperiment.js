(function()
 {
     var connectionDelay = (Math.random() * 7000) + 3000;
     
     setTimeout(function()
		{
		    document.getElementById('divConnecting').className = 'notcurrent';
		    document.getElementById('frmDestructionInput').className = 'current';
		}, connectionDelay);
     
     var btnDone = document.getElementById('btnDone');

     if(btnDone != null)
     {
	 btnDone.addEventListener('click', function()
				  {
				      window.location.href = 'SVO';
				  });

     }

     var btnSubmit = document.getElementById('btnSubmit');

     if(btnSubmit != null)
     {
	 btnSubmit.addEventListener('click', function()
				    {
					var f = document.getElementById('frmDestructionInput');
					if(f.rdoDestroy.value != '' && f.rdoPartnerDestroy.value != '')
					{
					    f.submit();
					}
				    });
     }

     var prolificImage = document.getElementById('prolificImage');

     if(prolificImage != null)
     {	 
	 prolificImage.width = prolificImage.parentElement.clientWidth - 10;
     }
     
 })();
