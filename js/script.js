async function getSongs(folder) {
  currFolder = folder;
  const baseURL = `https://raw.githubusercontent.com/shubhampatel1573/spotify/main/`;
  const folderURL = `${baseURL}${folder}/`;

  let a = await fetch(folderURL);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    let element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  }

  // Show all the songs in playlist
  let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (let song of songs) {
    songUL.innerHTML += `<li>
                       <img src="img/music.svg" alt="" class="invert">
                       <div class="info">
                           <div>${song.replaceAll("%20", " ")}</div>
                           <div>Shubham</div>
                       </div>
                       <div class="playnow">
                           <span>play</span>
                           <img src="img/play.svg" alt="" class="invert">
                       </div>
                      </li>`;
  }

  // Attach event listener to each song
  Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
      play.src = "img/pause.svg";
      document.querySelector(".songinfo").innerHTML = e.getElementsByTagName("div")[0].firstElementChild.innerHTML;
    });
  });
  return songs;
}

let playMusic = (track, pause = false) => {
  const baseURL = `https://raw.githubusercontent.com/shubhampatel1573/spotify/main/`;
  currentSong.src = `${baseURL}${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  const baseURL = `https://raw.githubusercontent.com/shubhampatel1573/spotify/main/songs/`;
  let a = await fetch(baseURL);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");

  let array = Array.from(anchor);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").splice(-1)[0];

      // Get the metadata of the folder
      let a = await fetch(`${baseURL}${folder}/info.json`);
      let response = await a.json();

      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50"
                                color="#000000" fill="#1ed760">
                                <circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="1.5" />
                                <path
                                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                    fill="currentColor" />
                            </svg>
                        </div>
                        <img src="${baseURL}${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.discription}</p>
                    </div>`;
    }
  }

  // Load the playlist when the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async iteam => {
      songs = await getSongs(`songs/${iteam.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}
