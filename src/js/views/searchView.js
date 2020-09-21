import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const renderResults = (receipe,page=1,resPerPage=10) => {
            const start = (page-1)*resPerPage;
            const end = page*resPerPage;

            receipe.slice(start,end).forEach(renderReceipe);
            renderButtons(page,receipe.length,resPerPage);
}
export const limitReceipeTitle = (title, limit = 17) => {
            const newTitle = [];
            let firstTime = true;
            if(title.length > limit){
                        title.split(' ').reduce((acc,cur) => {
                                if((cur.length > 17)&&(firstTime)){
                                        const halfWord = cur.split('-');
                                        newTitle.push(halfWord[0]);
                                        firstTime = false;
                                }else if(acc + cur.length <= limit){
                                        newTitle.push(cur);
                                }
                                return acc + cur.length;
                        }, 0);
                        return `${newTitle.join(' ')} ...`;
            }
            return title;
}

const renderReceipe = receipe => {
            const l = 17;
            limitReceipeTitle(receipe.title,l);
            const markup = `
            <li>
                <a class="results__link" href="#${receipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${receipe.image_url}" alt="Test">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitReceipeTitle(receipe.title)}</h4>
                        <p class="results__author">${receipe.publisher}</p>
                    </div>
                </a>
            </li>`;
            elements.searchResultsList.insertAdjacentHTML('beforeend',markup);

}
export const clearInput = () => {
            elements.searchInput.value = '';
}
export const clearResults = () => {
            elements.searchResultsList.innerHTML = '';
            elements.searchResultsPages.innerHTML = '';
}
const createButton = (page, type) => `
            <button class="btn-inline results__btn--${type}" data-goto= ${type === 'prev' ? page - 1 : page + 1 }>
                <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>               
                <svg class="search__icon">
                                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right' }"></use>
                            </svg>
                        
            </button>
`;
const renderButtons = (page, numResults, resPerPage) => {
            let button;
            const pages = Math.ceil(numResults/resPerPage);
            if(page===1 && pages>1){
                button = createButton(page,'next');
            }else if(page<pages){
                button = `
                    ${createButton(page,'prev')}
                    ${createButton(page,'next')}
            `;
            }else if (page===pages && pages>1){
                button = createButton(page,'prev');
            }
            elements.searchResultsPages.insertAdjacentHTML('afterbegin',button);
}
export const highlightSelected = id =>{
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(el=>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}