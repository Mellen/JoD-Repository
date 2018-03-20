(function()
 {
     var btnDummies = document.getElementById('btnDummies');

     btnDummies.addEventListener('click', function()
				 {
				     var xhr = new XMLHttpRequest();
				     xhr.open('GET', 'experiment/participantresult/makedummies/');

				     xhr.addEventListener('load', function()
							  {
							      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
							      {
								  console.log(xhr.responseText);
								  var result = JSON.parse(xhr.responseText);
								  alert(result.msg);
							      }
							      else
							      {
								  console.log(xhr.responseText);
							      }
							  });

				     xhr.send();

				 });

     var delete_optouts = document.getElementById('btnCleanse');
     delete_optouts.addEventListener('click', function()
				     {
					 var xhr = new XMLHttpRequest();
					 xhr.open('GET', 'experiment/participantresult/deleteoptouts/');

					 xhr.addEventListener('load', function()
							      {
								  if(this.readyState === XMLHttpRequest.DONE && this.status === 200)
								  {
								      // thanks to Jonathan Amend (https://stackoverflow.com/users/530630/jonathan-amend)
								      // for this answer: https://stackoverflow.com/a/23797348/204723
								      var filename = "";
								      var disposition = xhr.getResponseHeader('Content-Disposition');
								      if (disposition && disposition.indexOf('attachment') !== -1) {
									  var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
									  var matches = filenameRegex.exec(disposition);
									  if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
								      }
								      var type = xhr.getResponseHeader('Content-Type');
								      var blob = new Blob([this.response], { type: type });
								      var downloadUrl = URL.createObjectURL(blob);
								      var a = document.createElement("a");
								      a.href = downloadUrl;
								      a.download = filename;
								      a.target = '_blank';
								      document.body.appendChild(a);
								      a.click();
								  }
								  else
								  {
								      console.log(xhr.responseText);
								  }
							      });
					 xhr.send()
				     });
 })();
