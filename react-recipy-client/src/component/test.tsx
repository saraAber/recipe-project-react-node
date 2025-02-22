// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import {
//   TextField,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Select,
//   MenuItem,
//   IconButton,
//   FormControl,
//   InputLabel,
//   styled,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveIcon from "@mui/icons-material/Remove";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import axios from "axios";
// import { useUser } from "../use-Context/userProvider";
// import { useNavigate } from "react-router-dom";
// const recipeSchema = Yup.object().shape({
//   name: Yup.string().required("שם המתכון חובה"),
//   instructions: Yup.string().required("הוראות הכנה חובה"),
//   difficulty: Yup.string().required("רמת קושי חובה"),
//   duration: Yup.number()
//     .required("זמן הכנה חובה")
//     .positive("הזמן חייב להיות חיובי"),
//   description: Yup.string().required("תיאור חובה"),
//   img: Yup.string()
//     .url("כתובת תמונה לא תקינה")
//     .required("קישור לתמונה חובה"),
//   ingredients: Yup.array()
//     .of(
//       Yup.object().shape({
//         name: Yup.string().required("שם מוצר חובה"),
//         count: Yup.string().required("כמות חובה"),
//         type: Yup.string().required("סוג כמות חובה"),
//       })
//     )
//     .required("יש להזין לפחות מרכיב אחד")
//     .min(1, "יש להזין לפחות מרכיב אחד"),
// });
// const CustomTextField = styled(TextField)({
//   marginBottom: "16px",
//   width: "100%",
//   '& .MuiOutlinedInput-root': {
//     '&.Mui-focused fieldset': {
//       borderColor: "#888", // שינוי הצבע של המסגרת במצב פוקוס לאפור
//     },
//   },
// });
// // עיצוב מותאם אישית לכפתור
// const CustomButton = styled(Button)({
//   width: "100%",
//   backgroundColor: '#444',
//   color: 'white',
//   padding: "12px 0",
//   borderRadius: "8px",
//   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
//   '&:hover': {
//     backgroundColor: '#666',
//   },
// });

// type FormValues = {
//   name: string;
//   instructions: string;
//   difficulty: string;
//   duration: number;
//   description: string;
//   img: string;
//   ingredients: Array<{
//     name: string;
//     count: string;
//     type: string;
//   }>;
// };
// const AddRecipeForm = () => {
//   const { user } = useUser();
//   const userId = user.Id;
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: yupResolver(recipeSchema),
//     defaultValues: {
//       ingredients: [{ name: "", count: "", type: "" }],
//     },
//   });
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "ingredients",
//   });
//   // ingredients: data.ingredients ?? [], // אם undefined, נהפוך למערך ריק

//   const onSubmit = async (data: FormValues) => {
//     // מיפוי המרכיבים כך שהשדות יהיו בשמות שהשרת מצפה להם
//     const mappedIngredients = data.ingredients.map((item) => ({
//       Name: item.name,  // במקום "name"
//       Count: item.count, // במקום "count"
//       Type: item.type,   // במקום "type"
//     }))

//     // מיפוי השדות כך שיתאימו לשמות שהשרת מצפה להם
//     const payload = {
//       Name: data.name,
//       UserId: userId,
//       Instructions: { Name: data.instructions },
//       Difficulty: data.difficulty,
//       Duration: data.duration,
//       Description: data.description,
//       CategoryId: 12, // לא צריך להיתיחס לקטגוריה
//       Img: data.img,
//       Ingridents: mappedIngredients,
//     }

//     try {
//       const response = await axios.post("http://localhost:8080/api/recipe", payload);
//       console.log("✅ מתכון נוסף בהצלחה:", response.data);
//     } catch (error) {
//       console.error("❌ שגיאת שרת", error);
//     }
//   }

//   return (
//     <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>
//           הוספת מתכון
//         </Typography>
// <form
//   onSubmit={(event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     console.log("📌 נתוני הטופס:", Object.fromEntries(formData));
//     onSubmit(Object.fromEntries(formData))}}>        
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <CustomTextField label="שם המתכון" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />
//             </Grid>
//             <Grid item xs={6}>
//               <FormControl fullWidth error={!!errors.difficulty}>
//                 <InputLabel id="difficulty-label">רמת הקושי</InputLabel>
//                 <Select labelId="difficulty-label" defaultValue="" {...register("difficulty")}>
//                   <MenuItem value="קל">קל</MenuItem>
//                   <MenuItem value="בינוני">בינוני</MenuItem>
//                   <MenuItem value="קשה">קשה</MenuItem>
//                   <MenuItem value="מיטיבי לכת">מיטיבי לכת</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={6}>
//               <CustomTextField label="זמן הכנה (דקות)" type="number" {...register("duration")} error={!!errors.duration} helperText={errors.duration?.message} />
//             </Grid>-
//             <Grid item xs={12}>
//               <CustomTextField label="תיאור קצר" {...register("description")} error={!!errors.description} helperText={errors.description?.message} />
//             </Grid>
//             <Grid item xs={12}>
//               <CustomTextField label="קישור לתמונה" {...register("img")} error={!!errors.img} helperText={errors.img?.message} />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography variant="h6" gutterBottom>
//                 מרכיבים
//               </Typography>
//             </Grid>
//             {fields.map((item, index) => (
//               <Grid container spacing={2} key={item.id} alignItems="center">
//                 <Grid item xs={4}>
//                   <CustomTextField label="שם מוצר" {...register(`ingredients.${index}.name`)} error={!!errors.ingredients?.[index]?.name} helperText={errors.ingredients?.[index]?.name?.message} />
//                 </Grid>
//                 <Grid item xs={3}>
//                   <CustomTextField label="כמות" {...register(`ingredients.${index}.count`)} error={!!errors.ingredients?.[index]?.count} helperText={errors.ingredients?.[index]?.count?.message} />
//                 </Grid>
//                 <Grid item xs={3}>
//                   <CustomTextField label="סוג כמות" {...register(`ingredients.${index}.type`)} error={!!errors.ingredients?.[index]?.type} />
//                 </Grid>
//                 <Grid item xs={2}>
//                   <IconButton onClick={() => remove(index)} color="error">
//                     <RemoveIcon />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             ))}
//             <Grid item xs={12}>
//               <CustomButton onClick={() => append({ name: "", count: "", type: "" })} startIcon={<AddIcon />} variant="contained">
//                 הוסף מרכיב
//               </CustomButton>
//             </Grid>
//             {/* כפתור שליחה */}
//             <Grid item xs={12}>
//                <Button type="submit" color="primary" fullWidth> 
//                 הוסף מתכון
//               </Button> 
//               {/* <button type="submit">שלח טופס</button> */}

//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default AddRecipeForm;
