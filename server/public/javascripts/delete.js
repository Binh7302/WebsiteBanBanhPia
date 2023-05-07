const delete_btn = document.querySelectorAll(".btn-table.delete");
const edit_btn = document.querySelectorAll(".btn-table.edit");
const cont = document.querySelector('.delete_cont');
let deleted_id;
let deleted_index;

const delete_open_modal = (id, index) => {
    console.log("clicked delete_open_modal")
    cont.classList.add("display");
    for (let i = 0; i < delete_btn.length; i++) {
        delete_btn[i].disabled = true;
    }
    for (let i = 0; i < edit_btn.length; i++) {
        edit_btn[i].disabled = true;
    }
    deleted_id = id;
    deleted_index = index;
}

const delete_cancel = () => {
    cont.classList.remove("display");
    for (let i = 0; i < delete_btn.length; i++) {
        delete_btn[i].disabled = false;
    }
    for (let i = 0; i < edit_btn.length; i++) {
        edit_btn[i].disabled = false;
    }
    deleted_id = null;
    deleted_index = null;
}

const onDelete = () => {
    const del_index = deleted_index - 1;
    const del = document.querySelectorAll('.del_btn');
    for (let i = 0; i < del.length; i++) {
        if (i == del_index) {
            del[i].click();
        }
    }
}