import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { use, useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { UserContext, useUser } from "../use-Context/userProvider"
import { Ingrident } from "../moduls/Ingrident";
import { useEffect } from "react";
import { Rec } from "../moduls/Recipe";
const recipeSchema = Yup.object().shape({
  name: Yup.string().required("שם המתכון חובה"),
  instructions: Yup.string().required("הוראות הכנה חובה"),
  difficulty: Yup.string().required("רמת קושי חובה"),
  duration: Yup.number()
    .required("זמן הכנה חובה")
    .positive("הזמן חייב להיות חיובי"),
  description: Yup.string().required("תיאור חובה"),
  img: Yup.string()
    .url("כתובת תמונה לא תקינה")
    .required("קישור לתמונה חובה"),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("שם מוצר חובה"),
        count: Yup.string().required("כמות חובה"),
        type: Yup.string().required("סוג כמות חובה"),
      })
    )
    .required("יש להזין לפחות מרכיב אחד")
    .min(1, "יש להזין לפחות מרכיב אחד"),
});
type FormValues = {
  name: string;
  instructions: string;
  difficulty: string;
  duration: number;
  description: string;
  img: string;
  ingredients: Array<{
    name: string;
    count: string;
    type: string;
  }>;
};

const EditRecipe = () => {
  const { id } = useParams(); // שליפת ה-id מתוך ה-URL
  console.log("Recipe ID:", id); // לבדיקה
  const location = useLocation();
  const r = location.state?.recipe as Rec; // המרת הנתונים לאובייקט מסוג Rec
  const recipe =
  {
    name: r.Name,
    instructions: r.Instructions,
    difficulty: r.Difficulty,
    duration: r.Duration,
    description: r.Description,
    img: r.Img,
    // מיפוי המערך כדי למלא את ה-ingredients
    ingredients: r.Ingridents?.map((ing: Ingrident) => ({
      name: ing.Name || "",     // שם המוצר
      count: ing.Count || "",   // כמות המוצר
      type: ing.Type || "",     // סוג הכמות
    }))
  }
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm<FormValues>({
    resolver: yupResolver(recipeSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // ================================
  const { user } = useUser(); // שימוש בפונקציה הבטוחה
  const userId = user?.Id // לדוגמה
  const navigate = useNavigate();

  useEffect(() => {
    if (recipe) {
      setValue("name", recipe.name || "");
      setValue("instructions", Array.isArray(recipe.instructions) ? recipe.instructions.map((item: Ingrident) => item.Name).join(", ") : recipe.instructions || "");
      setValue("duration", recipe.duration || 0);
      setValue("description", recipe.description || "");
      setValue("img", recipe.img || "");
      setValue("ingredients", recipe.ingredients || [{ name: "", count: "", type: "" }]);
    }
  }, []); //במה תהיה התלות?

  const onSubmit = async (data: FormValues) => {
    // מיפוי המרכיבים כך שהשדות יהיו בשמות שהשרת מצפה להם
    const mappedIngredients = data.ingredients.map((item) => ({
      Name: item.name,  // במקום "name"
      Count: item.count, // במקום "count"
      Type: item.type,   // במקום "type"
    }))
    const payload = {
      Id: id,
      Name: data.name,
      UserId: user.Id,
      Instructions: { Name: data.instructions },
      Difficulty: data.difficulty,
      Duration: data.duration,
      Description: data.description,
      CategoryId: 12, // לא צריך להיתיחס לקטגוריה
      Img: data.img,
      Ingridents: mappedIngredients,
    }
    console.log("out");

    try {
      console.log("try in");

      const response = await axios.post("http://localhost:8080/api/recipe/edit", payload);
      console.log("✅ המתכון עודכן בהצלחה:", response.data);
      navigate('/home')
    } catch (error) {
      console.error("❌ שגיאת שרת", error);
    }
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          עריכת מתכון
        </Typography>
        <form onSubmit={handleSubmit((data) => {
          console.log("Submitting...", data);
          onSubmit(data);
        })}>
          <Grid container spacing={2}>
            {/* שם המתכון */}
            <Grid item xs={12}>
              <TextField
                label="שם המתכון"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            {/* הוראות הכנה */}
            <Grid item xs={12}>
              <TextField
                label="הוראות הכנה"
                fullWidth
                multiline
                rows={3}
                {...register("instructions")}
                error={!!errors.instructions}
                helperText={errors.instructions?.message}
              />
            </Grid>
            {/* רמת קושי */}
            <Grid item xs={6}>
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel id="difficulty-label">רמת הקושי</InputLabel>
                <Select
                  labelId="difficulty-label"
                  label="רמת הקושי"
                  defaultValue=""
                  {...register("difficulty")}
                // value={watch("difficulty") || ""}
                >
                  <MenuItem value="קל">קל</MenuItem>
                  <MenuItem value="בינוני">בינוני</MenuItem>
                  <MenuItem value="קשה">קשה</MenuItem>
                  <MenuItem value="מיטיבי לכת">מיטיבי לכת</MenuItem>
                </Select>
              </FormControl>
              {errors.difficulty && (
                <Typography variant="caption" color="error">
                  {errors.difficulty.message}
                </Typography>
              )}
            </Grid>
            {/* זמן הכנה */}
            <Grid item xs={6}>
              <TextField
                label="זמן הכנה (דקות)"
                type="number"
                fullWidth
                {...register("duration")}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>
            {/* תיאור קצר */}
            <Grid item xs={12}>
              <TextField
                label="תיאור קצר"
                fullWidth
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            {/* קישור לתמונה */}
            <Grid item xs={12}>
              <TextField
                label="קישור לתמונה"
                fullWidth
                {...register("img")}
                error={!!errors.img}
                helperText={errors.img?.message}
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
                    {...register(`ingredients.${index}.name`)}
                    error={!!errors.ingredients?.[index]?.name}
                    helperText={errors.ingredients?.[index]?.name?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="כמות"
                    fullWidth
                    {...register(`ingredients.${index}.count`)}
                    error={!!errors.ingredients?.[index]?.count}
                    helperText={errors.ingredients?.[index]?.count?.message}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="סוג כמות"
                    fullWidth
                    {...register(`ingredients.${index}.type`)}
                    error={!!errors.ingredients?.[index]?.type}
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
            {/* כפתור להוספת מרכיב */}
            <Grid item xs={12}>
              <Button
                onClick={() => append({ name: "", count: "", type: "" })}
                startIcon={<AddIcon />}
                variant="contained"
              >
                הוסף מרכיב
              </Button>
            </Grid>
            {/* כפתור שליחה */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                עדכן מתכון
              </Button>

            </Grid>
          </Grid>
        </form>

      </CardContent>
    </Card>
  )

}
export default EditRecipe