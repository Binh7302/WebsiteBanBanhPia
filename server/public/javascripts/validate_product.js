const validation = () => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const des = document.getElementById('des').value;
    const brand = document.getElementById('brand').value;
    const exp = document.getElementById('exp').value;
    const wei = document.getElementById('wei').value;
    const ing = document.getElementById('ing').value;
    const proMan = document.getElementById('proMan').value;
    const preserve = document.getElementById('pre').value;
    const check = document.getElementById('check');
    const submit = document.getElementById('submit');

    if (!name || !price || !des || !check.checked || !submit || !preserve || !brand || !exp || !wei || !ing || !proMan) {
        submit.disabled = true;
    } else {
        submit.disabled = false;
    }
}