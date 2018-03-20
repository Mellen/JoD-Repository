(function()
 {
     var btn = document.getElementById('btnFinish');
     
     btn.addEventListener('click', function()
			  {
			      if(document.allOK.acceptance.value != "")
			      {
				  jQuery.post('finalAcceptanceCheck',
					      jQuery(document.allOK).serialize(),
					      function(data)
					      {
						  document.allOK.innerHTML = '<p class="bg-info">'+data.msg+'</p>'
					      });
			      }
			      else
			      {
				  alert('Please select an option.');
			      }
			  });
 })();
