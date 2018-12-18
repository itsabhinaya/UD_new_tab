$(document).ready(function(){
  function setMode() {
    chrome.storage.sync.get('settings', function(storedObj){
      if (Object.keys(storedObj).length === 0) {
        console.log("Using default settings");
      }
      // console.log(storedObj.settings);
      if (storedObj.settings) {
        if (storedObj.settings.mode == 'dark') {
            makeDarkMode();
        } else {
            makelightMode();
        }
      }
    });
  }

  function makeDarkMode(argument) {
    $('body').removeClass("light_mode");
    $('body').addClass("dark_mode");
    // console.log("light to dark");
  }

  function makelightMode(argument) {
    $('body').removeClass("dark_mode");
    $('body').addClass("light_mode");
    // console.log("dark to light");
  }

  $('.sun_icon').on("click", function() {
    var settings = {};
      if ($("body").hasClass("dark_mode")) {
        makelightMode();
        settings.mode = 'light';
        chrome.storage.sync.set({ 'settings': settings }, function() {
          console.log("Settings saved");
        });
        
      }else{  
        makeDarkMode();
        settings.mode = 'dark';
        chrome.storage.sync.set({ 'settings': settings }, function() {
          // Notify that we saved.
          console.log("Settings saved");
        });
      };
  });

  
  $('.back_icon').on("click", function() {
    window.history.back();
  });

  $(".save_words").on("click", function(){
    var no_words = $('#no_words').val();

    console.log(no_words);

    chrome.storage.sync.set({ 'no_words': no_words }, function() {
      // console.log("no_words event saved");
      $("#no_words:text").val(no_words);
      console.log("pen icon set words");
    });

    $(".save_words").fadeOut(function () {
      $(".save_words").text("Saved!").fadeIn();
      $(".save_words").addClass('saved_color');
      setTimeout(function () {
        $(".save_words").removeClass('saved_color');
        $(".save_words").text("Save").fadeIn();
      }, 2000);
    });

    chrome.storage.sync.remove('word_dict');
    var word_dict = [];
      chrome.storage.sync.set({ 'word_dict': word_dict }, function() {
        console.log("word_dict is set")
      });
    getAllRandomWords();
  });

  $(".reset_settings").on("click", function(){
    console.log("Settings reseted");
    chrome.storage.sync.clear();
    
    $("#no_words:text").val("");
    $(".reset_settings").fadeOut(function () {
      $(".reset_settings").text("Reseted").fadeIn();
      setTimeout(function () {
        $(".reset_settings").text("Reset All Settings").fadeIn();
      }, 2000);
    });


   chrome.storage.sync.get('word_dict', function(storedObj){
      var word_dict = [];
      chrome.storage.sync.set({ 'word_dict': word_dict }, function() {
        console.log("word_dict is set")
      });
      console.log("dict empty");
      getAllRandomWords();
    });


  });


  async function getAllRandomWords(){
    var allRandomWords = [];
    await fetch('http://api.urbandictionary.com/v0/random',{mode: 'cors'})
    .then((resp) => resp.json())
    .then(data => {
      data.list.map(info => {
        allRandomWords.push(info.word);
      });
      // console.log(allRandomWords);
    });

    allRandomWords.forEach(function(randomWord){
      getWordData(randomWord);
    });

  }

  async function getWordData (word) {
    wordArray = [];

    await fetch('http://api.urbandictionary.com/v0/define?term='+word, {mode: 'cors'})
    .then((resp) => resp.json())
    .then(data => {
      wordArray = [word,data.list[0].definition,data.list[0].example];
      // console.log([word,data.list[0].definition,data.list[0].example]);
        chrome.storage.sync.get('no_words', function(storedObj){
          if(storedObj.no_words){

            substringsArray = storedObj.no_words.split(',').map(item => item.trim()); //slpit the words into array and remove any trailing whitespaces
            substringsArray = substringsArray.filter(Boolean); //remove empty array elements
            // console.log(substringsArray);
            defCheck =  substringsArray.some(substring=>data.list[0].definition.includes(substring));
            exaCheck =  substringsArray.some(substring=>data.list[0].example.includes(substring));
            if (defCheck == false && exaCheck == false){
              // console.log("word is safe");
              pushWordToWordDict(wordArray);
            }
          }else{
              pushWordToWordDict(wordArray);
          }
        });
      });
  
  }

  function pushWordToWordDict(wordArray){
    chrome.storage.sync.get('word_dict', function(storedObj){
        word_dict = storedObj.word_dict;
        word_dict.push(wordArray);
        chrome.storage.sync.set({ 'word_dict': word_dict }, function() {
          console.log("new word is added to array");
        });
      });
  }


  //Takes a sentence and changes the regex words into url words in the sentence.
  function word_url(sentence) {
    var word_regex=/\[([a-zA-Z0-9]|\s|\_|\-|\/|\')+\]/gi;
    words_to_change = sentence.match(word_regex) //Finds all the words that match the regex of "[words]"
    // console.log(words_to_change)
    //skip the url change if there aren't any
    if(words_to_change){
      for (i = 0; i < words_to_change.length; i++) { 
        word = words_to_change[i].substr(1).slice(0, -1) //removes the brackets of words
        w_url = '<a href="https://www.urbandictionary.com/define.php?term='+word+'">'+word+'</a>' //turns the word into url
        sentence = sentence.replace(words_to_change[i],w_url) //replaces the word with url word
      }
    }
    return sentence;
  }


  function outputHtml(wordInfo) {
     document.getElementById("word").innerHTML = '<a href="https://www.urbandictionary.com/define.php?term='+wordInfo[0]+'">'+wordInfo[0]+'</a>' ;
     var wrapper = document.getElementById("dec");
     var myHTML = '';
     myHTML += '<h4 class="definition">' + wordInfo[1] + '</h4>';
     myHTML += '<p class="example">' + wordInfo[2] + '</p>';
     myHTML += "<hr>"
     wrapper.innerHTML = myHTML
  }

  function wordPartsForOutput(wordParts) {
    var space_regex = /\n/gi;

    definition = wordParts[1].replace(space_regex,'<br>\n')
      if (definition == [] || definition == null){
        definition = " "
      }else{
        definition = word_url(definition)
      }

    example = wordParts[2].replace(space_regex,'<br>\n');
      if (example == [] || example == null){
        example = " "
      }else{
       example = word_url(example)
      }
    
    wordParts = [wordParts[0],definition,example];
    outputHtml(wordParts);

  }

  function init(){
    setMode();
    if (document.getElementById("word")) {
      chrome.storage.sync.get('word_dict', function(storedObj){
        if (!storedObj.word_dict) {
          exampleWord = ['clout',
          '<a href="https://www.urbandictionary.com/define.php?term=Clout">Clout</a> is being <a href="https://www.urbandictionary.com/define.php?term=famous">famous</a> and having <a href="https://www.urbandictionary.com/define.php?term=influence">influence</a>',
          'Wow - <a href="https://www.urbandictionary.com/define.php?term=Rice">Rice</a>, <a href="https://www.urbandictionary.com/define.php?term=Mitch">Mitch</a>, and <a href="https://www.urbandictionary.com/define.php?term=Banks">Banks</a> have hella clout']
          outputHtml(exampleWord);

          var word_dict = [];
          chrome.storage.sync.set({ 'word_dict': word_dict }, function() {
            console.log("word_dict is set")
          });
          console.log("dict empty");
          getAllRandomWords();

        } else if (storedObj.word_dict.length <= 2) {
          wordPartsForOutput(storedObj.word_dict.shift());
          chrome.storage.sync.set({ 'word_dict': storedObj.word_dict }, function() {
            console.log("word_dict is set")
          });

          getAllRandomWords();
          console.log("new words added word_dict");
          // chrome.storage.sync.get('word_dict', function(storedObj){
          //   console.log(storedObj.word_dict);
          // });

        } else {
          // console.log(storedObj.word_dict);

          wordPartsForOutput(storedObj.word_dict.shift());
          chrome.storage.sync.set({ 'word_dict': storedObj.word_dict }, function() {
            // console.log("word_dict is set")
          });

          // chrome.storage.sync.get('word_dict', function(storedObj){
          //   console.log(storedObj.word_dict);
          // });
        }
      });
    }else{
      chrome.storage.sync.get('no_words', function(storedObj){
        console.log("second page");
        no_words = storedObj.no_words
        $("#no_words:text").val(no_words);
        console.log(no_words);
      });
    }

  };
init();

})
