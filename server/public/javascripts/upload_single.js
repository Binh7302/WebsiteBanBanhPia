const fileName = document.querySelector(".img_filename");
const wrapper = document.querySelector(".img_wrapper");
const img = document.querySelector(".img_here");
const btn = document.querySelector("#file-upload");
const cancelBtn = document.querySelector("#cancel-btn i");
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

//choose a file
btn.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const result = reader.result;
            img.src = result;
            img.hidden = false;
            wrapper.classList.add("active");
        }

        //cancel a file
        cancelBtn.addEventListener("click", function () {
            img.src = "";
            img.hidden = true;
            wrapper.classList.remove("active");
        })
        reader.readAsDataURL(file);
    }

    //set text for the file
    if (this.value) {
        let valueStore = this.value.match(regExp);
        fileName.textContent = valueStore;
    }
});
