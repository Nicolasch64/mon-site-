function toggleLanguageMenu() {
	const menu = document.getElementById("languageMenu");
	menu.classList.toggle("show");
}

const choixlangue = document.getElementById("choixlangue");
choixlangue.addEventListener("click", () => {
	toggleLanguageMenu();
});
window.addEventListener("click", (event) => {
	if (!event.target.matches("#choixlangue")) {
		let languagemenu = document.getElementById("languageMenu");
		if (languagemenu.classList.contains("show")) {
			languagemenu.classList.remove("show");
		}
	}
});
