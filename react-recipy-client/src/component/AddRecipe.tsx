import React, { use, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { TextField, Button, Grid, Card, CardContent, Typography, Select, MenuItem, IconButton, FormControl, InputLabel, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import {  useUser } from "../use-context/userProvider";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../use-context/categoryProvider";
const recipeSchema = Yup.object().shape({
  Name: Yup.string().required("שם המתכון חובה"),
  Instructions: Yup.string().required("הוראות הכנה חובה"),
  Difficulty: Yup.string().required("רמת קושי חובה"),
  Duration: Yup.number()
    .required("זמן הכנה חובה")
    .positive("הזמן חייב להיות חיובי"),
  Description: Yup.string().required("תיאור חובה"),
  Category : Yup.string().required("קטגוריה חובה"),
  Img: Yup.string()
    .url("כתובת תמונה לא תקינה")
    .required("קישור לתמונה חובה"),
  Ingredients: Yup.array()
    .of(
      Yup.object().shape({
        Name: Yup.string().required("שם מוצר חובה"),
        Count: Yup.string().required("כמות חובה"),
        Type: Yup.string().required("סוג כמות חובה"),
      })
    )
    .required("יש להזין לפחות מרכיב אחד")
    .min(1, "יש להזין לפחות מרכיב אחד"),
});
// =====================אוביקט שהוספתי כך היה לי נוח יותר למדל את הטופס=========================
type FormValues = {
  Name: string;
  Instructions: string;
  Difficulty: string;
  Duration: number;
  Description: string;
  Category: string;
  Img: string;
  Ingredients: Array<{
    Name: string;
    Count: string;
    Type: string;
  }>;
};
// =================עיצוב שהוספתי על "אמ יו אי" לשדות והכפתורים של הטופס===========================
const CustomTextField = styled(TextField)({
  width: '100%',
  marginBottom: '20px', // רווח בין השדות
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#444', // קו מיתאר אפור כהה יותר
    },
    '&:hover fieldset': {
      borderColor: '#444', // קו מיתאר אפור כהה יותר בהובר
    },
  },
  '& .MuiInputLabel-root': {
    color: '#444', // צבע האותיות של הלייבל אפור כהה יותר
  }
});

const CustomButton = styled(Button)({
  backgroundColor: '#444', // צבע רקע אפור כהה
  color: 'white', // צבע הטקסט
  padding: '10px 0', // רווח פנימי
  borderRadius: '8px', // פינות מעוגלות
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // צל חזק יותר
  '&:hover': {
    backgroundColor: '#666', // צבע כהה יותר בהובר
  },
});
// ============================================
const AddRecipeForm = () => {

  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user.Id
  const { categories, setCategories } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(recipeSchema),
    defaultValues: {
      Name: "",
      Instructions: "",
      Difficulty: "",
      Duration: 0,
      Description: "",
      Category: "",
      Img: "",
      Ingredients: [{ Name: "", Count: "", Type: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Ingredients",
  });



  const onSubmit = async (data: FormValues) => {
    const mappedIngredients = data.Ingredients.map((item) => ({
      Name: item.Name,
      Count: item.Count,
      Type: item.Type,
    }))

    const payload = {
      Name: data.Name,
      UserId: userId,
      Instructions: [{ Name: data.Instructions }],
      Difficulty: data.Difficulty,
      Duration: data.Duration,
      Description: data.Description,
      CategoryId: Number(data.Category),
      Img: data.Img,
      Ingridents: mappedIngredients,
    }

    try {
      const response = await axios.post("http://localhost:8080/api/recipe", payload);
      console.log("✅ מתכון נוסף בהצלחה:", response.data);
      alert("✅ מתכון נוסף בהצלחה:")
      navigate('/home')

    } catch (error) {
      console.error("❌ שגיאת שרת", error);
    }
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          הוספת מתכון
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* שם המתכון */}
            <Grid item xs={12}>
              <TextField
                label="שם המתכון"
                fullWidth
                {...register("Name")}
                error={!!errors.Name}
                helperText={errors.Name?.message}
              />
            </Grid>
            {/* הוראות הכנה */}
            <Grid item xs={12}>
              <TextField
                label="הוראות הכנה"
                fullWidth
                multiline
                rows={3}
                {...register("Instructions")}
                error={!!errors.Instructions}
                helperText={errors.Instructions?.message}
              />
            </Grid>
            {/* רמת קושי */}
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.Difficulty}>
                <InputLabel id="difficulty-label">רמת הקושי</InputLabel>
                <Select
                  labelId="difficulty-label"
                  label="רמת הקושי"
                  defaultValue=""
                  {...register("Difficulty")}
                >
                  <MenuItem value="קל">קל</MenuItem>
                  <MenuItem value="בינוני">בינוני</MenuItem>
                  <MenuItem value="קשה">קשה</MenuItem>
                  <MenuItem value="מיטיבי לכת">מיטיבי לכת</MenuItem>
                </Select>
              </FormControl>
              {errors.Difficulty && (
                <Typography variant="caption" color="error">
                  {errors.Difficulty.message}
                </Typography>
              )}
            </Grid>
            {/* זמן הכנה */}
            <Grid item xs={6}>
              <TextField
                label="זמן הכנה (דקות)"
                type="number"
                fullWidth
                {...register("Duration")}
                error={!!errors.Duration}
                helperText={errors.Duration?.message}
              />
            </Grid>
            {/* תיאור קצר */}
            <Grid item xs={12}>
              <TextField
                label="תיאור קצר"
                fullWidth
                {...register("Description")}
                error={!!errors.Description}
                helperText={errors.Description?.message}
              />
            </Grid>
            {/* קטגוריה - דרופדאון */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.Category}>
                <InputLabel id="category-label">קטגוריה</InputLabel>
                <Controller
                  name="Category" 
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="category-label"
                      label="קטגוריה"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.Id} value={category.Id}>
                          {category.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {/* קישור לתמונה */}
            <Grid item xs={12}>
              <TextField
                label="קישור לתמונה"
                fullWidth
                {...register("Img")}
                error={!!errors.Img}
                helperText={errors.Img?.message}
              />
            </Grid>
            {/* כותרת קבוצת מרכיבים */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                מרכיבים
              </Typography>
            </Grid>
            {/* מרכיבים – דינמיים */}
            {fields.map((item, index) => (
              <Grid
                container
                spacing={2}
                key={item.id}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Grid item xs={4}>
                  <TextField
                    label="שם מוצר"
                    fullWidth
                    {...register(`Ingredients.${index}.Name`)}
                    error={!!errors.Ingredients?.[index]?.Name}
                    helperText={errors.Ingredients?.[index]?.Name?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="כמות"
                    fullWidth
                    {...register(`Ingredients.${index}.Count`)}
                    error={!!errors.Ingredients?.[index]?.Count}
                    helperText={errors.Ingredients?.[index]?.Count?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="סוג כמות"
                    fullWidth
                    {...register(`Ingredients.${index}.Type`)}
                    error={!!errors.Ingredients?.[index]?.type}
                  // helperText={errors.ingredients?.[index]?.type?.message}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            {/* כפתור הוספת מרכיב */}
            <Grid item xs={12}>
              <CustomButton
                onClick={() => append({ Name: "", Count: "", Type: "" })}
                startIcon={<AddIcon />}
                sx={{ width: '40%' }} // גודל מותאם אישית
              >
                הוסף מרכיב
              </CustomButton>
            </Grid>

            {/* כפתור הוספת מתכון */}
            <Grid item xs={12}>
              <CustomButton
                type="submit"
                sx={{ width: '100%' }} // שיהיה רחב כמו קודם
              >
                הוסף מתכון
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AddRecipeForm;