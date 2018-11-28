const url = 'http://api.urbandictionary.com/v0/random';
var span = document.createElement("span");
var space_regex = /\n/gi;
var word_regex=/\[([a-zA-Z0-9]|\s|\_|\-|\/|\')+\]/g;



//Takes a sentence and changes the regex words into url words in the sentence.
function word_url(sentence) {
	words_to_change = sentence.match(word_regex) //Finds all the words that match the regex of "[words]"
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
	for (var i = 0; i < 3; i++) {
		definition = data.list[i].definition.replace(space_regex,'<br>\n')
		example = data.list[i].example.replace(space_regex,'<br>\n');
		myHTML += '<h3 class="definition">' + word_url(definition) + '</h3>';
		myHTML += '<p class="example">' + word_url(example) + '</p>';
		myHTML += "<hr>"
	}
	wrapper.innerHTML = myHTML


})
.catch(function(error) {
	console.log(error);
});  
