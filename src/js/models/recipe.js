import axios from 'axios';

export default class Recipe {
			constructor(id){
						this.recipe_id = id;
            }
            async getRecipe(){
                        try{
                            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.recipe_id}`);
                            console.log(res);
                            this.title = res.data.recipe.title;
                            this.img = res.data.recipe.image_url;
                            this.ingredients = res.data.recipe.ingredients;
                            this.url = res.data.recipe.source_url;
                            this.publisher = res.data.recipe.publisher;
                            this.publisher_url = res.data.recipe.publisher_url;
                            this.social_rank = res.data.recipe.social_rank;
                        }catch(error){
                            alert(error);
                        }
            }
            calculateTime(){
                const numIng = this.ingredients.length;
                const periods = Math.ceil(numIng/3);
                this.time = periods * 15;
            }

            calculateServings(){
                this.servings = 4;
            }
            parseIngredients(){
                const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
                const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];

                const newIngredient = this.ingredients.map( el => {
                    //1.Uniform units
                    let ingredient = el.toLowerCase();
                    unitsLong.forEach((unit, i) => {
                        ingredient = ingredient.replace(unit, unitsShort[i]);
                    });
                    // 2.Remove parentheses (With regular function)
                    ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
                    // 3. Parse ingredients into: count, unit and ingredient.
                    const arrIng = ingredient.split(' ');
                    const unitIndex = arrIng.findIndex(ele => unitsShort.includes(ele));
                    let objIng;
                    console.log('pre-IF');
                    if(unitIndex > -1){ //there is a unit
                        const arrCount = arrIng.slice(0,unitIndex);
                        let count;
                        console.log('post-COUNT');

                        if(arrCount.length === 1){

                              console.log('Eval-1');
                            count = eval(arrIng[0].replace('-','+'));

                            console.log(arrIng[0]);
                        }else{

                             console.log('Eval-2');
                             console.log(unitIndex);
                            count = eval(arrIng.slice([0], unitIndex).join('+'));
                        }
                        console.log('post-EVAL');

                        objIng = {
                            count,
                            unit: arrIng[unitIndex],
                            ingredient: arrIng.slice(unitIndex + 1).join(' ')
                        };
                        console.log('CREO-1');
                    }else if(parseInt(arrIng[0], 10)){ // there is NO unit but the 1st element is a number
                        objIng = {
                            count: parseInt(arrIng[0],10),
                            unit: ' ',
                            ingredient: arrIng.slice(1).join(' ')
                        };
                        console.log('CREO-2');
                    }else if(unitIndex === -1){// there is NO unit and NO number in first position
                        objIng = {
                            count: 1,
                            unit: ' ',
                            ingredient
                        };

                        console.log('CREO-3');
                    }
                    return objIng;
                });
                this.ingredients = newIngredient;
            }
            updateServings(type){
                        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;
                        this.ingredients.forEach(ing => (ing.count *= (newServings/this.servings)).toFixed(2));
                        this.servings = newServings;
            }
}
