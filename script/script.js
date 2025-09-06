// word pronunciation
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Synonyms Element তৈরি
const createElement = (arr) => {
  const htmlElements = arr.map(
    (el) => `<span class = "btn bg-[#1A91FF10]">${el}</span> `
  );
  return htmlElements.join(" ");
};

// loading spinner functionality , Spinner Handle করা
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// সার্ভার থেকে সব লেভেলের লেসন ডাটা এনে displayLesson() এ পাঠায়।
const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json()) //promise of json data
    .then((json) => displayLesson(json.data));
};
// Lesson Button এর Active Class ম্যানেজ করা
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  // console.log(lessonBtns);
  lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

// Level অনুযায়ী Word লোড করা
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const clickBtn = document.getElementById(`lesson-button-${id}`);
      // console.log(clickBtn);
      removeActive();
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

// Word এর Details লোড করা , নির্দিষ্ট word এর বিস্তারিত তথ্য আনে (meaning, example, synonyms ইত্যাদি)।
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetail(details.data);
};

// word details modal popup এ দেখায়। এখানে meaning, sentence, synonyms, pronunciation দেখানো হয়।
const displayWordDetail = (word) => {
  console.log(word);
  const detailBox = document.getElementById("details-container");
  detailBox.innerHTML = `
    <div class="space-y-3">
      <h2 class="font-bold text-xl">${
        word.word
      } (<i class="fa-solid fa-microphone-lines"></i>${
    word.pronunciation
  }) </h2>
     
    </div>
     <div class="space-y-2">
        <h2 class="font-bold">Meaning</h2>
        <p class="font-bangla font-semibold"> ${word.meaning}</p>
      </div>
    <div class="space-y-2">
      <h2 class="font-bold">Example</h2>
      <p> ${word.sentence}</p>
    </div>
    <div class="space-y-2">
      <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
      <div>${createElement(word.synonyms)}</div>
      <div class="my-3"> <span class="btn bg-blue-700 text-white rounded-lg">Complete Learning</span></div>
      </div>

      <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
    
    `;
  document.getElementById("word_modal").showModal();
};

// 👉 লেভেলের সব word কার্ড আকারে দেখায়।
// {
//     "id": 64,
//     "level": 5,
//     "word": "Notorious",
//     "meaning": "কুখ্যাত / বদনামি",
//     "pronunciation": "নোটোরিয়াস"
// }

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="font-bangla text-center py-10 mx-auto col-span-full"><img class="mx-auto" src="./assets/alert-error.png" alt="">
    <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
  <h2 class="font-medium text-4xl my-5">নেক্সট Lesson এ যান।</h2>
  </div>
    `;
  }

  words.forEach((word) => {
    console.log(word);
    const wordCard = document.createElement("div");
    wordCard.innerHTML = `
     <div class="bg-white rounded-xl shadow-sm text-center py-10 px-10 space-y-4">
    <h2 class="font-bold text-2xl">${word.word}</h2>
    <p class="font-semibold">Meaning /Pronunciation</p>
    <div class="font-bangla text-2xl font-medium mb-10"> "${
      word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
    } 
    / ${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"
    }" </div>
    <div class="flex justify-between items-center">
    <button onclick="loadWordDetail(${
      word.id
    })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-circle-info"></i></button>
    <button onClick = "pronounceWord('${
      word.word
    }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF]"><i class="fa-solid fa-volume-high"></i></button></div>
  </div>
    `;
    wordContainer.appendChild(wordCard);
  });
  manageSpinner(false);
};

// প্রতিটি Lesson এর জন্য একটা বাটন তৈরি করে container এ অ্যাপেন্ড করে
const displayLesson = (lessons) => {
  const getContainer = document.getElementById("level-container");
  getContainer.innerHTML = "";

  for (const lesson of lessons) {
    // console.log(lesson);
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-button-${lesson.level_no}"
         onclick ="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>
        Lesson ${lesson.level_no}</button>
        `;
    getContainer.appendChild(btnDiv);
  }
};
loadLesson();

// Search Functionality
document.getElementById("search-btn").addEventListener("click", () => {
  const input = document.getElementById("search-input");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
