import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Rec } from '../moduls/Recipe';
import { Navigate } from 'react-router-dom';
import { UserContext, useUser } from '../use-Context/userProvider';
import { CardActions } from '@mui/material';
import { Card, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import pastaImg from "../images/pasta.jpg";

//mui עיצוב מותאם אישית לכרטיסים בשיתוף 
// ========================================
const PageContainer = styled('div')({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)', // רקע בהיר יותר
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
});

const RecipeGrid = styled(Grid)({
  maxWidth: '1200px',
});

const CustomCard = styled(Card)({
  backgroundColor: 'rgb(255, 255, 255)', // רקע כהה לכרטיס
  color: 'rgb(61, 53, 53)', // טקסט בהיר
  borderRadius: '12px',
  boxShadow: '0px 4px 12px rgb(92, 86, 86)',
  '&:hover': {
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
  },
  width: '100%',
});

// שינוי לעיצוב הכפתורים כך שיהיו אחידים ועם צל
const CustomButton = styled(Button)({
  width: '120px', // גודל אחיד לכפתורים
  backgroundColor: '#333',  // צבע אפור כהה
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px', // פינות מעוגלות
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',  // צל עדין
  '&:hover': {
    backgroundColor: '#555', // צבע כהה יותר בהובר
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',  // צל חזק יותר בהובר
  },
  marginRight: '10px',  // מרווח בין הכפתורים
});

// שינוי במיקום הכפתורים בתוך כל כרטיס בנפרד
const CardActionsStyled = styled(CardActions)({
  display: 'flex',
  justifyContent: 'flex-start', // ממוקם בצד שמאל
  padding: '16px', // רווחים נאים
  position: 'relative',  // הכפתורים יהיו בתחתית הכרטיס
  bottom: '0',  // ממוקם בתחתית
  left: '0',  // בצד שמאל
  width: '100%', // משתרע על כל רוחב הכרטיס
});
// =============================================

const Recipe = () => {
  const [recipes, setRecipes] = useState<Rec[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  // בעת שינוי במערך המתכונים תהיה טעינה מחדש 
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recipe");
        const formattedRecipes = response.data.map((recipe: any) => ({
          ...recipe,
          Instructions: recipe.Instructions.map((i: any) => i.Name).join(", ") // המרה של מערך לשם אחד
        }));
        setRecipes(formattedRecipes);
      } catch (err) {
        console.log("error");
      }
    };
    fetchRecipes();
  }, [recipes]);

  //פונקצית מחיקת מתכון
  const delRecipe = async (recipe: Rec) => {
    console.log("in recipe page user id is:", user.Id);
    if (recipe.UserId === user.Id) {
      try {
        await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`);
        console.log("המתכון נמחק בהצלחה");

      } catch (error) {
        console.error("❌ שגיאת שרת", error);
      }
    } else {
      alert("❌🤔 המחיקה מותרת לבעל המתכון בלבד");
    }
  };

  // פונקצית עריכת מתכון
  const editRecipe = (recipe: Rec) => {
    navigate(`/home/edit/${recipe.Id}`, { state: { recipe } });
  };

  return (
    <PageContainer>
      <RecipeGrid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" align="center" style={{ marginBottom: '20px', color: '#333' }}>
            🤍 :המומלצים שלנו
          </Typography>
        </Grid>

        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} key={recipe.Id} display="flex" justifyContent="center">
            <CustomCard>
              <CardMedia
                component="img"
                height="250"
                image={recipe.Img}
                alt={pastaImg}
              />

              <CardContent>
                <Typography gutterBottom variant="h5">{recipe.Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>משך הכנה:</strong> {recipe.Duration} <br />
                  <strong>רמת קושי:</strong> {recipe.Difficulty} <br />
                  <strong>תיאור:</strong> {recipe.Description} <br />
                  <strong>הוראות:</strong> {recipe.Instructions} {/* הצגת ההוראות */}
                </Typography>
              </CardContent>

              <Typography variant="h6" sx={{ marginTop: 2 }}>רכיבים:</Typography>

              <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
                {recipe.Ingridents.map((ingredient, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    {ingredient.Name} - {ingredient.Count} {ingredient.Type}
                  </li>
                ))}
              </ul>

              {/* הכפתורים יופיעו בתוך כל כרטיס בנפרד */}
              <CardActionsStyled>
                <CustomButton size="small" onClick={() => delRecipe(recipe)}>
                  Delete
                </CustomButton>
                <CustomButton size="small" onClick={() => editRecipe(recipe)}>
                  Edit
                </CustomButton>
              </CardActionsStyled>
            </CustomCard>
          </Grid>
        ))}
      </RecipeGrid>
    </PageContainer>
  );
};

export default Recipe;
