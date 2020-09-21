import { elements } from "./base";

export const renderItem = item => {
        const markup = `
            <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__count">
                <input class="shopping__count-value" type="number" value="${item.count}" step="1">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
        `;
        elements.shopList.insertAdjacentHTML('beforeend', markup);
};
export const deleteItem = id =>{
    const item = document.querySelector(`[data-itemid="${id}"]`);
    console.log(item.id);
    if(item) item.parentElement.removeChild(item);
    console.log(item.id);
};
