import { Link, Outlet } from "react-router-dom"
import { UserContext, useUser } from "../use-context/userProvider"
import Recipe from "./Recipe"
import AddRecipe from "./AddRecipe"
import EditRecipe from "./EditRecipe"
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { use, useContext, useEffect, useState } from "react"
import Test1 from "./Search"
import { useCategories } from "../use-context/categoryProvider"
import axios from "axios"
import Search from "./Search"

const Home = () => {

    const { user } = useUser(); // שימוש בפונקציה הבטוחה
    const [showAddRecipe, setShowAddRecipe] = useState(false); // מצב להצגת הכפתור
    const { categories, setCategories } = useCategories();

    useEffect(() => {

        if (user?.Id !== 0) {
            setShowAddRecipe(true);
        } else {
            setShowAddRecipe(false);
        }
    }, [user]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/category");
            setCategories(response.data);
            console.log("✅ קטגוריות נטענו בהצלחה:", response.data);

        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {//====
        fetchCategories();
    }, []);

    return (
        <>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>

                <div style={{ display: "flex", gap: "15px" }}>
                    {!(user?.Id != undefined && showAddRecipe) &&

                        <Link to="login">
                            <Button sx={{ color: "#333" }}>Login</Button>
                        </Link>
                    }
                    {!(user?.Id != undefined && showAddRecipe) &&
                        <Link to="sighnin">
                            <Button sx={{ color: "#333" }}>Sign Up</Button>
                        </Link>
                    }


                    {user?.Id != undefined && showAddRecipe && ( // מציג רק אם המשתמש מחובר
                        <Link to="addRecipe">
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#333", color: "white", "&:hover": { backgroundColor: "#555" } }}
                            >
                                Add New Recipe
                            </Button>
                        </Link>
                    )}
                    
                </div>

                <Box sx={{ display: "flex", alignItems: "center", paddingRight: "10%" }}>
                    <Avatar sx={{ bgcolor: "#333" }}>
                        {user?.Name?.charAt(0).toUpperCase() || "❔"}
                    </Avatar>
                </Box>

            </header>
            <Outlet />
            <h1>Recipe in a Click</h1>
            <Search></Search>
            <Recipe />
            <h4>© by tehils shinfeld</h4>
        </>
    );
}
export default Home;