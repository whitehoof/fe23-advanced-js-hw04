"use strict"

const films = 'https://ajax.test-danit.com/api/swapi/films';
const container = document.querySelector('.container');

fetch(films)
.then(res => res.json())
.then(data => {
	data.forEach( (film, index) => {
		const filmCard = `
		<div class="film">
			<h2 class="film__name">
				<span class="film__episodeid">${film.episodeId}.</span>
				${film.name}
			</h2>
			<div class="film__characters">
				<div class="preloader" id="preloader-${index}">Loading...</div>
				<p class="film__characters--list hidden" id="characters-${index}">
				</p>
			</div>
			<p class="film__openingcrawl">${film.openingCrawl.replace(/\`/g, "'")}</p>
		</div>`;
		container.insertAdjacentHTML('beforeend', filmCard);

		const charactersArr = [];
		const charList = document.querySelector(`#characters-${index}`);

		film.characters.forEach( characterURL => {
			fetch(characterURL)
			.then(res => res.json())
			.then (data => {
				// дослідив, як виділити окремий елемент:
				if (data.name === 'Yoda') {
					charactersArr.push(`<span class="yoda">${data.name}</span>`);
				} else {
					charactersArr.push(data.name);
				}
				charList.innerHTML = charactersArr.join(', ');

				// коли ВСІ персонажі даного кіна завантажилися:
				if(film.characters.length === charactersArr.length) {
					document.querySelector(`#characters-${index}`).classList.remove('hidden');
					document.querySelector(`#preloader-${index}`).remove();
				}
			})
			.catch(err => console.warn("CHARACTERS ERROR:", err))
			.finally( () => {
			});
		});
	});
})
.catch(err => console.warn("FILM ERROR:", err));

