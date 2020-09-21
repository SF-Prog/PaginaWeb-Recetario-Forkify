import uniqid from 'uniqid';

export default class List{
        constructor(){
            this.items = [];
        }
        addItem(count, unit, ingredient){
                const item ={
                    id: uniqid(),
                    count,
                    unit,
                    ingredient
                };
                this.items.push(item);
                return item; //Facilita implementacion en Index(BUENA PRACTICA)
        }
        removeItem(id){
                const index = this.items.findIndex(el=>el.id === id);
                this.items.splice(index,1); //A partir del index corta un elemento
        }
        updateCount(id,newCount){
                this.items.find(el=>el.id===id).count = newCount;
        }
}