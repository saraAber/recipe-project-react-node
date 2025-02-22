import { Link, Outlet } from "react-router-dom"
import  { UserContext, useUser } from "../use-Context/userProvider"
import Recipe from "./Recipe"
import AddRecipe from "./AddRecipe"
import EditRecipe from "./EditRecipe"
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useContext, useEffect, useState } from "react"

const Home = () => {
    const { user } = useUser(); // שימוש בפונקציה הבטוחה
    const [showAddRecipe, setShowAddRecipe] = useState(false); // מצב להצגת הכפתור
    console.log(user,"**************************");
    useEffect(() => {
        if (user.Id !== 0) {
            setShowAddRecipe(true);  // אם משתמש מחובר, הצג את כפתור ה-AddRecipe
            console.log(showAddRecipe);
            
        } else {
            setShowAddRecipe(false); // אם לא מחובר, הסתר את כפתור ה-AddRecipe
            console.log(showAddRecipe);

        }
    }, [user]); // העדכון יקרה בכל פעם שה-user משתנה    console.log(user);

    return <>
        <header>
            <Link to="login">
                <Button sx={{ color: "#333" }}>Login</Button>
            </Link>
            <Link to="sighnin">
                <Button sx={{ color: "#333" }}>Sign Up</Button>
            </Link>
            {showAddRecipe && (  // מציג רק אם המשתמש מחובר
                <Link to="addRecipe">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#333", color: "white", "&:hover": { backgroundColor: "#555" } }}
                    >
                        Add New Recipe
                    </Button>
                </Link>
            )}
        </header>
        <Outlet></Outlet>
        <h1>Recipe in a Click</h1>
        <Recipe></Recipe>
    </>
}
export default Home