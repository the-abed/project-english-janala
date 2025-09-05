const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json()) //promise of json data
    .then(json => displayLesson(json.data));
}
const loadLevelWord = (id) =>{
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => displayLevelWord(data.data))
}
const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

// {
//     "id": 64,
//     "level": 5,
//     "word": "Notorious",
//     "meaning": "কুখ্যাত / বদনামি",
//     "pronunciation": "নোটোরিয়াস"
// }

    words.forEach(word =>{
    console.log(word);
    const wordCard = document.createElement('div');
    wordCard.innerHTML = `
     <div class="bg-white rounded-xl shadow-sm text-center py-10 px-10 space-y-4">
    <h2 class="font-bold text-2xl">${word.word}</h2>
    <p class="font-semibold">Meaning /Pronunciation</p>
    <div class="font-bangla text-2xl font-medium mb-10"> "${word.meaning} / ${word.pronunciation}" </div>
    <div class="flex justify-between items-center"> <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-circle-info"></i></button> <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-volume-high"></i></button></div>
  </div>
    `
    wordContainer.appendChild(wordCard)
   })
}

const displayLesson = (lessons) =>{
    const getContainer = document.getElementById("level-container");
    getContainer.innerHTML = "";

    for(const lesson of lessons){
        // console.log(lesson);
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button onclick ="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>
        Lesson ${lesson.level_no}</button>
        `
        getContainer.appendChild(btnDiv);
}}
loadLesson()
