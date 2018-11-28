  const url = 'http://api.urbandictionary.com/v0/random';
  var span = document.createElement("span");

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
  	document.getElementById("word").innerHTML = data.list[0].word;
  	document.getElementById("definition").innerHTML = data.list[0].definition;
  	document.getElementById("example").innerHTML = data.list[0].example;

  })
  .catch(function(error) {
    console.log(error);
  });  
