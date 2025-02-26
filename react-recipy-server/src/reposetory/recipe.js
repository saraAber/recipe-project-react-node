const Ingridents = require("../model/ingridents");
const Instructions = require("../model/instructions");
const Recipe = require("../model/recipe");

const GetRecipeDb = async (Id) => {
   return Recipe.findOne({ where: { Id }, include: [Ingridents, Instructions] });
}

const GetRecipesDb = () => {
    return Recipe.findAll({ include: [Ingridents, Instructions] });
}

const AddRecipyDB = async (recipy) => {
    return await Recipe
        .create(recipy, {
            include: [Ingridents, Instructions]
        })
}

const EditRecipyDb = async (recipe) => {
    const recipeUpdate = await GetRecipeDb(recipe.Id)
    console.log("00000000000000000000000");
    
    console.log(recipe);
    
    return recipeUpdate.update(recipe)
}

const DeleteDb = (Id) => {
    return Recipe.destroy({ where: { Id } })
}


module.exports = { GetRecipeDb, AddRecipyDB, EditRecipyDb, DeleteDb, GetRecipesDb }
