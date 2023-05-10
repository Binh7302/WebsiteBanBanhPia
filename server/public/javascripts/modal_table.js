const cont = document.querySelector('.cart_cont');
const btn_open_cart = document.querySelector('.btn_open_cart');
const cart_open_modal = () => {
    cont.classList.add("display");
    btn_open_cart.disabled = true;
    submit.disabled = true;
    check.disabled = true;
}

const cart_cancel = () => {
    cont.classList.remove("display");
    btn_open_cart.disabled = false;
    submit.disabled = false;
    check.disabled = false;
}