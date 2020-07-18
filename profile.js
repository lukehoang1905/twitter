// user press choose file
// select file
// show file
// 


var fileTag = document.getElementById("filetag"),
    preview = document.getElementById("preview");

fileTag.addEventListener("change", function() {
    changeImage(this);
});
let link

function changeImage(input) {
    var reader;
    if (input.files && input.files[0]) {
        reader = new FileReader();
        console.log(input.files.value)
        console.log(input.files[0].value)
        reader.onload = function(e) {
            preview.setAttribute('src', e.target.result);
            link = e.target.result

        }

        reader.readAsDataURL(input.files[0]);
    }
}
let profile = document.getElementById("profile")
const propic = () => {
    profile.setAttribute('src', link)
    var yourImg = document.getElementById('profile');
    if (yourImg && yourImg.style) {
        yourImg.style.height = '100px';
        yourImg.style.width = '200px';
    }
}