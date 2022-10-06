/**
 * Created by Gergely on 9/16/2017.
 */

$(document).ready(function () {
// Changing background images
    var images = [
        "/img/background/brugessquare.jpg",
        "/img/background/primrosehillview.jpg",
        "/img/background/tinystonehengeandlake.jpg"
    ]

    var imageHead = document.getElementById('profile');


    var credits = [
        "Gergely Szabo, July of 2016 <br> The Market Square, Bruges, Belgium",
        "Gergely Szabo, August of 2017 <br> Primrose Hill Regent's Park, London, United Kingdom",
        "Gergely Szabo, July of 2017 <br> Weißsee, High Tauern, Austria"
    ]

    var photoCreditText = document.getElementById('photo-credit');

    var i = 0;
    setInterval(function () {
        imageHead.style.backgroundImage = "url(" + images[i] + ")";
        photoCreditText.innerHTML = credits[i];
        i = i + 1;
        if (i == images.length) {
            i = 0;
        }
    }, 10000);

//Loading gif fadeout after page is loaded, gif from https://loading.io/
//     $(window).on('load', function () {
//         $(".se-pre-con").fadeOut("slow");
//     });
});