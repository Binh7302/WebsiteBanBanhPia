const validation = () => {
    const check = document.getElementById('check');
    const submit = document.getElementById('submit');
    if (!check.checked || !submit) {
        submit.disabled = true;
    } else {
        submit.disabled = false;
    }
}