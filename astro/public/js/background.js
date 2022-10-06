const images = [
  "brugessquare.jpg",
  "primrosehillview.jpg",
  "tinystonehengeandlake.jpg",
];

const credits = [
  "Gergely Szabo, July of 2016 <br> The Market Square, Bruges, Belgium",
  "Gergely Szabo, August of 2017 <br> Primrose Hill Regent's Park, London, United Kingdom",
  "Gergely Szabo, July of 2017 <br> Weißsee, High Tauern, Austria",
];

const imageHead = document.getElementById('profile');
const photoCreditTextEl = document.getElementById('photo-credit');

let i = 0;

setInterval(() => {
  if (imageHead && photoCreditTextEl) {
    imageHead.style.backgroundImage = `url(/img/background/${images[i]})`;
    photoCreditTextEl.innerHTML = credits[i];
    i = i == images.length ? 0 : i += 1;
  }
}, 10000);