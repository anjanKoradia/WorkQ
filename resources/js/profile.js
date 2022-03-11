const imgDropZone = document.querySelector(".user_profile");
const editImgBtn = document.querySelector(".edit_img_btn");
const fileInput = document.querySelector("#imageInput");

function updateImg(file) {
    let thumbnailElement = imgDropZone.querySelector(".drop_zone_thumb");

    if (imgDropZone.querySelector(".la-user")) {
        imgDropZone.querySelector(".la-user").remove();
    }
    if (imgDropZone.querySelector(".profile_img")) {
        imgDropZone.querySelector(".profile_img").remove();
    }

    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop_zone_thumb");
        imgDropZone.appendChild(thumbnailElement);
    }

    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
}


export default function profile() {
    if (editImgBtn) {
        editImgBtn.addEventListener("click", () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            if (fileInput.files.length) {
                updateImg(fileInput.files[0]);
            }
        });
    }

}