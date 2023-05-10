const validation = () => {
    const name = document.getElementById('name').value;
    const check = document.getElementById('check');
    const submit = document.getElementById('submit');

    if (!name || !check.checked || !submit ) {
        submit.disabled = true;
    } else {
        submit.disabled = false;
    }
}