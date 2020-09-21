import axios from 'axios';

export default class Search{
			constructor(query){
						this.query = query;
			}
			async getResults(){
							try{
									console.log(this.query);

									if(this.query.includes(' ')) this.query = encodeURIComponent(this.query); 
									const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
									this.result = res.data.recipes;
									this.query = decodeURIComponent(this.query);
							}catch(error){
									console.log(error);
									alert('We are sorry, something went wrong we the search...');
							}
			}
}
