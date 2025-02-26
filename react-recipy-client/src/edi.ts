import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextField, Button, Card, CardContent, Typography, IconButton, Box, MenuItem } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import mobxRec from "./mobxRec";
import { useNavigate } from "react-router-dom";
import { CatContext } from "./categoriesContext";

const schema = yup.object().shape({
  Name: yup.string().required("שם הוא שדה חובה"),
  Difficulty: yup.string().required("דרגת קושי היא שדה חובה"),
  Duration: yup.number().required("משך זמן הוא שדה חובה").min(0, "משך הזמן חייב להיות חיובי"),
  Description: yup.string().required("תיאור הוא שדה חובה"),
  CategoryId: yup.number().required("קטגוריה היא שדה חובה"),
  Img: yup.string().notRequired(),
  Instructions: yup.array().of(
    yup.object().shape({
      Name: yup.string().required("הוראה היא שדה חובה"),
    })
  ).default([]),
  Ingridents: yup.array().of(
    yup.object().shape({
      Name: yup.string().required("שם מרכיב הוא שדה חובה"),
      Count: yup.number().required("כמות היא שדה חובה").min(0, "הכמות חייבת להיות חיובית"),
      Type: yup.string().required("סוג הוא שדה חובה"),
    })
  ).default([]),
});

const EditRecipie = () => {
    const { categories } = useContext(CatContext);
  const nav = useNavigate();
  const currentRecipe = mobxRec.getCurrRecipie() || {};
  const { control, handleSubmit, register, formState: { errors }, setValue, reset } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      Name: "",
      Difficulty:"",
      Duration: 0,
      Description: "",
      CategoryId: 0,
      Img: "",
      Instructions: [],
      Ingridents: [],
    },
  });

  const { fields: instructions, append: addInstruction, remove: removeInstruction } = useFieldArray({ control, name: "Instructions" });
  const { fields: ingredients, append: addIngredient, remove: removeIngredient } = useFieldArray({ control, name: "Ingridents" });

  useEffect(() => {
    if (currentRecipe) {
      reset({
        Name: mobxRec.getCurrRecipie()?.Name || "",
        Difficulty: mobxRec.getCurrRecipie()?.Difficulty ||"",
        Duration:  mobxRec.getCurrRecipie()?.Duration || 0,
        Description:  mobxRec.getCurrRecipie()?.Description || "",
        CategoryId:  mobxRec.getCurrRecipie()?.CategoryId || 0,
        Img:  mobxRec.getCurrRecipie()?.Img || "",
        Instructions:  mobxRec.getCurrRecipie()?.Instructions?.length ? mobxRec.getCurrRecipie()?.Instructions : [{ Name: "" }],
        Ingridents:  mobxRec.getCurrRecipie()?.Ingridents?.length ?  mobxRec.getCurrRecipie()?.Ingridents : [{ Name: "", Count: 0, Type: "" }],
      });
    }
  }, [currentRecipe, reset]);

  const onSubmit = async (data: any) => {
    const recipeId = mobxRec.getCurrRecipie()?.Id;
    const updatedData = { ...data, Id: recipeId, UserId: mobxRec.getCurrRecipie()?.UserId };
    
    try {
      await axios.post("http://localhost:8080/api/recipe/edit", updatedData, {
        headers: { "Content-Type": "application/json" },
      });
      mobxRec.currRecipie=updatedData; // יש לעדכן את MobX
      nav(`/ShowRecipes/ShowRecipe/${updatedData.Name}`); // מעביר לעמוד המתכון
    } catch (error) {
      console.error("Error updating recipe", error);
    }
  };
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Card sx={{ width: 600, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>עריכת מתכון</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField label="שם המתכון" {...register("Name")} error={!!errors.Name} helperText={errors.Name?.message} fullWidth sx={{ mb: 2 }} />
            <TextField select label="דרגת קושי" {...register("Difficulty")} error={!!errors.Difficulty} helperText={errors.Difficulty?.message} fullWidth sx={{ mb: 2 }}>
              <MenuItem value="קלה">קלה</MenuItem>
              <MenuItem value="בינונית">בינונית</MenuItem>
              <MenuItem value="קשה">קשה</MenuItem>
            </TextField>
            <TextField label="משך זמן" type="number" {...register("Duration")} error={!!errors.Duration} helperText={errors.Duration?.message} fullWidth sx={{ mb: 2 }} />
            <TextField label="תיאור" {...register("Description")} error={!!errors.Description} helperText={errors.Description?.message} fullWidth sx={{ mb: 2 }} />
            <TextField select label="קטגוריה "{...register("CategoryId")} error={!!errors.CategoryId} helperText={errors.CategoryId?.message} fullWidth sx={{ mb: 2 }}>
             {categories&&categories.map((item)=> <MenuItem value={item.Id}>{item.Name}</MenuItem>)}
                  
             
            </TextField>
            <TextField label="כתובת תמונה (לא חובה)" {...register("Img")} error={!!errors.Img} helperText={errors.Img?.message} fullWidth sx={{ mb: 2 }} />

            <Typography variant="h6" gutterBottom>הוראות הכנה</Typography>
            {instructions.map((instruction, index) => (
              <Box key={instruction.id} display="flex" alignItems="center" gap={2} mb={2}>
                <TextField label={`הוראה ${index + 1}`} {...register(`Instructions.${index}.Name`)} error={!!errors.Instructions?.[index]?.Name} helperText={errors.Instructions?.[index]?.Name?.message} fullWidth />
                <IconButton color="secondary" onClick={() => removeInstruction(index)}><RemoveCircleIcon /></IconButton>
              </Box>
            ))}
            <IconButton color="primary" onClick={() => addInstruction({ Name: "" })}><AddCircleIcon /></IconButton>
            <Typography variant="h6" gutterBottom>רשימת מרכיבים</Typography>
            {ingredients.map((ingredient, index) => (
              <Box key={ingredient.id} display="flex" alignItems="center" gap={2} mb={2}>
                <TextField label="שם" {...register(`Ingridents.${index}.Name`)} error={!!errors.Ingridents?.[index]?.Name} helperText={errors.Ingridents?.[index]?.Name?.message} fullWidth />
                <TextField label="כמות" type="number" {...register(`Ingridents.${index}.Count`)} error={!!errors.Ingridents?.[index]?.Count} helperText={errors.Ingridents?.[index]?.Count?.message} fullWidth />
                <TextField label="סוג" {...register(`Ingridents.${index}.Type`)} error={!!errors.Ingridents?.[index]?.Type} helperText={errors.Ingridents?.[index]?.Type?.message} fullWidth />
                <IconButton color="secondary" onClick={() => removeIngredient(index)}><RemoveCircleIcon /></IconButton>
              </Box>
            ))}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>עדכון מתכון</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditRecipie;