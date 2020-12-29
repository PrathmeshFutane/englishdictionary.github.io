

let searchBtn = document.querySelector('#search');
let notfound = document.querySelector('.notfound');
let def = document.querySelector('.def');
let apiKey = 'f4b809e8-d75f-41e1-9e9f-745f1ab0bd62';

let audiobox = document.querySelector('.audio');
let typebox = document.querySelector('.type');
let loading = document.querySelector('.loading');

let saveword = document.querySelector('.saveword');

let variable_for_localstorage = 0;



searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    audiobox.innerHTML = '';
    notfound.innerText = '';
    def.innerHTML = '';
    let input = document.querySelector('#input');
    //get input data
        let word = input.value;
        


    // call API get data
    if(word === ''){
        alert("word is require");
        return;
    }
    else{
        getData(word);
    }

    
})




async function getData(word){
    loading.style.display = 'block';
    //ajax call

   let xhr = new XMLHttpRequest();
   xhr.open('GET', `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`, true);

   xhr.onload = function(){

        

       if(this.status == 200){
           let data = JSON.parse(this.responseText);

           //if empty result
           if(!data.length){
            loading.style.display = 'none';
               notfound.innerText = 'No result found';
               return;
           }
           //if result is suggestion
           if(typeof data[0] === 'string'){
            loading.style.display = 'none';
               let heading = document.createElement('h3');
               heading.innerText = 'Did you mean?'
               notfound.appendChild(heading);
               data.forEach(x=>{
                   let suggestion = document.createElement('span');
                   suggestion.classList.add('suggested');
                   suggestion.innerText = x;
                   notfound.appendChild(suggestion);
               })

              
                
           } 

           //if result is found
           let defination = data[0].shortdef[0];
           def.innerText ="Defination :-  "+ defination;
           def.classList.add('name');
           loading.style.display = 'none';
           saveword.style.display = 'block';

           //saving the word in local storage
          
           let wholevalue = `${word} :- ${defination}`;

           let words = [];
           words.push(wholevalue);

           localStorage.setItem("arrayOfWord", words);

           for(let i=0; i<localStorage.length; i++){
               console.log(localStorage.getItem("arrayOfWord"));
           }
           
           // sound
           const soundname = data[0].hwi.prs[0].sound.audio;
           if(soundname){
               renderSound(soundname);

           }

           //type
           const type = data[0].fl;
           typebox.classList.add('name');
           typebox.innerText = type;
           
           



           //console.log(data);
           
       }

       variable_for_localstorage ++;


   }

   xhr.send();
   
}


function renderSound(soundname){
    let subfolder = soundname.charAt(0);
    let soundsrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundname}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src=soundsrc;
    aud.controls = true;
   
    audiobox.appendChild(aud);

}
