const fs = require('fs');
const fsp = fs.promises;

class JSONModifier {

    filePath;
    jsonData;

    constructor(path){
        this.filePath = path;
    }

    async read(filePath = this.filePath){
        const fileContent = await fsp.readFile(filePath);
        return this.jsonData = JSON.parse(fileContent);
    }

    async insert(data){
        const jsonData = await this.read();

        data.id = jsonData.length > 0 ? jsonData[jsonData.length-1].id + 1 : 1;

        jsonData.push(data);

        await fsp.writeFile(this.filePath, JSON.stringify(jsonData));

        return data;
    }

    async update(data, id){
        const jsonData = await this.read();
        const edited = jsonData.find(element => element.id === id);


        if(edited){
            Object.assign(edited, data);
            return fsp.writeFile(this.filePath, JSON.stringify(jsonData));
        }

        return null;
    }

    async delete(id){
        const jsonData = await this.read();
        const deletedIndex = jsonData.findIndex(element => element.id == id);
        
        if(deletedIndex){
            jsonData.splice(deletedIndex, 1);
            return fsp.writeFile(this.filePath, JSON.stringify(jsonData));
        }

        return null;
    }

    async find(fn){
        const jsonData = await this.read();
        return jsonData.find(fn);
    }

    async filter(fn){
        const jsonData = await this.read();
        return jsonData.filter(fn);
    }

    async getById(id){
        const jsonData = await this.read();
        const findProd = jsonData.find(element => element.id == id);
        return findProd;
    }
}

module.exports = {JSONModifier};

