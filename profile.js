// fileUpload.addEventListener('change', e => {
//     classImgList = [".firstImg", ".secondImg", ".thirdImg", ".fourthImg"];
//     srcImgList = [];
//     let myFiles = e.target.files
//     for (let index = 0; index < myFiles.length; index++) {
//         const reader = new FileReader();
//         const element = myFiles[index];
//         reader.readAsDataURL(element);
//         reader.onload = e => {
//             let imgClass = classImgList.shift();
//             srcImgList.push(e.target.result);
//             $("#image-container " + imgClass).attr("src", e.target.result);
//             $("#image-container " + imgClass).css("display", "block");
//         }
//     }
// })


let fileTag = document.getElementById("filetag"),
    preview = document.getElementById("preview");

fileTag.addEventListener("change", function() {
    changeImage(this);
});

function changeImage(input) {
    var reader;

    if (input.files && input.files[0]) {
        reader = new FileReader();
        reader.onload = function(e) {
            preview.setAttribute('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}