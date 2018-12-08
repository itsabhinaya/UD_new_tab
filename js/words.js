$(document).ready(function(){

	chrome.storage.sync.get('no_words', function(storedObj){
		console.log("second page");
		no_words = storedObj.no_words
	$("#no_words:text").val(no_words);

    console.log(no_words);
  });

})