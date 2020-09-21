import Search from './models/search';
import Recipe from './models/recipe';
import List from './models/list';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
import { toggleLikeBtn } from './views/likesView';

const state = {};

const controlSearch = async () => {
			//1. Get Query from View
			let query = searchView.getInput();
			console.log(query);
			if(query){
						//2.New search object and add to state
						state.search = new Search(query);
						//3.Prepare UI for getResults
						searchView.clearInput();
						searchView.clearResults();
						renderLoader(elements.searchResultsBox);
						try{
							//4. Search for receipes
							await state.search.getResults();
							//5.Render the results on the UI.
							clearLoader();
							if(state.search) searchView.renderResults(state.search.result);
						}catch(error){
							alert(error);
							clearLoader();
						}
					}
};
elements.searchForm.addEventListener('submit', e => {
			e.preventDefault();
			controlSearch();
});
elements.searchResultsPages.addEventListener('click', e => {
	const btn = e.target.closest('.btn-inline');
	if(btn){
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}

});
const controlRecipe = async () => {
	const id = window.location.hash.replace('#','');
	console.log(id);
	if(id){

		console.log('entramo al if');
			//1. Prepare UI for changes
			recipeView.clearRecipe();
			//renderLoader(elements.recipe);
			//2. Create new Recipe object
			state.recipe = new Recipe(id);
			try{
						//3. get data from the Recipe
						await state.recipe.getRecipe();
						state.recipe.parseIngredients();
						//4. calculate Other attributes missing(time and servings)
						state.recipe.calculateTime();
						state.recipe.calculateServings();	
						//5. Render recipe
						if(state.search) searchView.highlightSelected(id);
						recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
			}catch(error){
						alert('Error processing the Recipe');
			}

	}
};
const controlList = () =>{
	if(!state.list) state.list = new List();
	state.recipe.ingredients.forEach(el=>{
		const item = state.list.addItem(el.count,el.unit,el.ingredient);
		listView.renderItem(item);
	});
};
const controlLikes = () =>{

		
		if(!state.likes) state.likes = new Likes();
		const currentID = state.recipe.recipe_id;
		
		if(!state.likes.isLiked(currentID)){ //Not Liked yet
			//Add like to the state
			const newLike = state.likes.addLike(
				currentID,
				state.recipe.title,
				state.recipe.publisher,
				state.recipe.img
			); 
			console.log(newLike);
			//Toggle the like button
			toggleLikeBtn(true);
			//Add like to UI list
			likesView.renderlike(newLike);
		}else{
			//Remove like from the state
			state.likes.deleteLike(currentID);
			//Toggle the like button
			toggleLikeBtn(false);
			//Remove like from the UI list
			likesView.removelike(currentID);
		}
		likesView.toggleLikeMenu(state.likes.likesLength());
};
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
elements.recipeSpace.addEventListener('click', e => {
			if (e.target.matches('.btn-decrease, .btn-decrease *')){
				if(state.recipe.servings > 1){	
					state.recipe.updateServings('dec');
					recipeView.updateServingsIngredients(state.recipe);
				}
			}else if(e.target.matches('.btn-increase, .btn-increase *')){
				state.recipe.updateServings('inc');
				recipeView.updateServingsIngredients(state.recipe);
			}else if(e.target.matches('.btn-small, .btn-small *')){
				controlList();
			}else if(e.target.matches('.recipe__love, .recipe__love *')){
				controlLikes();
			}
			console.log(state.recipe);
});
//Handling Delete and Update button
elements.shopList.addEventListener('click', e=> {
	console.log('AAA');	
	const id = e.target.closest('.shopping__item').dataset.itemid;
		//Handling Delete buttom
		console.log(id);	
		if(e.target.matches('.shopping__delete, .shopping__delete *')){
			console.log('1');	
				state.list.removeItem(id); //BackEnd List
				listView.deleteItem(id); // UI
		}else if(e.target.matches('.sopping__count-value')){
			
				const value = parseFloat(e.target.value, 10);
				console.log(`ACA esta el value: ${value}`);
				state.list.updateCount(id,value);
			
		}
});
window.addEventListener('load',()=>{
			state.likes = new Likes();
			// 1.Restore likes
			state.likes.readStorage();
			// 2. Toggle like Menu button
			likesView.toggleLikeMenu(state.likes.likesLength());
			// 3. Render the existing item
			state.likes.likes.forEach(like=>likesView.renderLike(like));
});
const tru = 'true';
const fal = 'false';
const ressss = (tru && tru);
console.log(`${ressss}`);