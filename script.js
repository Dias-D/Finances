const Modal = {
    open() {
        document.querySelector(".modal-overlay").classList.add("active");
    },
    close() {
        document.querySelector(".modal-overlay").classList.remove("active");
    },
};

document.querySelector(".open-modal").addEventListener("click", (e) => {
    e.preventDefault();
    Modal.open();
});

document.querySelector(".close-modal").addEventListener("click", (e) => {
    e.preventDefault();
    Modal.close();
});
