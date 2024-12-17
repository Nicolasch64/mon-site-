document.getElementById("loadButton").addEventListener("click", function () {
	fetch("bio.JSON")
		.then((response) => response.json())
		.then((data) => {
			displayBio(data.biographie);
			displayPhotos(data.photos);
		})
		.catch((error) =>
			console.error("Erreur de chargement du fichier JSON", error)
		);
});

function displayBio(bio) {
	const bioElement = document.getElementById("bio");
	bioElement.innerHTML = `
        <p><strong>Nom:</strong> ${bio.nom}</p>
        <p><strong>Date de naissance:</strong> ${bio.date_naissance}</p>
        
        <p><strong>Description:</strong> ${bio.description}</p>
        <p><strong>parutions:</strong> ${bio.parutions}</p>
    `;
}

function displayPhotos(photos) {
	const photoGallery = document.getElementById("photo-gallery");
	photoGallery.innerHTML = "";

	photos.forEach((photo) => {
		const photoElement = document.createElement("div");
		photoElement.innerHTML = `
            <img src="${photo.src}" alt="${photo.alt}" class="photo">
            <p>${photo.description}</p>
        `;
		photoGallery.appendChild(photoElement);
	});
}
