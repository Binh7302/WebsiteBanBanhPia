
const delete_img = (number) => {
	const title = '.del_files_area' + number.toString();
	const del = document.querySelector(title);
	del.remove();
}
