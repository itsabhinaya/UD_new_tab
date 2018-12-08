const url = 'http://api.urbandictionary.com/v0/random';
var span = document.createElement("span");
var space_regex = /\n/gi;
var word_regex=/\[([a-zA-Z0-9]|\s|\_|\-|\/|\')+\]/gi;

function toggleDarkLight() {
  var body = document.getElementById("body");
  var currentClass = body.className;
  body.className = currentClass == "dark-mode" ? "light-mode" : "dark-mode";
}


//Takes a sentence and changes the regex words into url words in the sentence.
function word_url(sentence) {
	words_to_change = sentence.match(word_regex) //Finds all the words that match the regex of "[words]"
	console.log(words_to_change)
	for (i = 0; i < words_to_change.length; i++) { 
		word = words_to_change[i].substr(1).slice(0, -1) //removes the brackets of words
		w_url = '<a href="https://www.urbandictionary.com/define.php?term='+word+'">'+word+'</a>' //turns the word into url
		sentence = sentence.replace(words_to_change[i],w_url) //replaces the word with url word
	}
	return sentence;
}

fetch(url)
.then((resp) => resp.json())
.then(data => data.list.pop())
.then(({word}) =>
	fetch(`http://api.urbandictionary.com/v0/define?term=${word}`)
	)
.then(resp => resp.json())
.then(data =>{

	console.log(data.list[0]);
	console.log(data.list[0].definition);
	console.log(data.list[0].word);
	console.log(data.list[0].permalink);
	console.log(data.list[0].example);
	word = data.list[0].word
	document.getElementById("word").innerHTML = '<a href="https://www.urbandictionary.com/define.php?term='+word+'">'+word+'</a>' ;

	var wrapper = document.getElementById("dec");
	var myHTML = '';
	definition = data.list[0].definition.replace(space_regex,'<br>\n')
	if (definition == []){
    // your code here.
    	definition = ""
	}else{
		definition = word_url(definition)
	}
	example = data.list[0].example.replace(space_regex,'<br>\n');
	if (example == []){
    // your code here.
    	example = ""
	}else{
		example = word_url(example)
	}

	myHTML += '<h4 class="definition">' + definition + '</h4>';
	myHTML += '<p class="example">' + example + '</p>';
	myHTML += "<hr>"
	wrapper.innerHTML = myHTML


})
.catch(function(error) {
	console.log(error);
});  
