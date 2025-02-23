import { Link, Outlet } from "react-router-dom"
import { UserContext, useUser } from "../use-Context/userProvider"
import Recipe from "./Recipe"
import AddRecipe from "./AddRecipe"
import EditRecipe from "./EditRecipe"
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { use, useContext, useEffect, useState } from "react"

const Home = () => {

    const { user } = useUser(); // שימוש בפונקציה הבטוחה
    const [showAddRecipe, setShowAddRecipe] = useState(false); // מצב להצגת הכפתור
    useEffect(() => {

        if (user?.Id !== 0) {
            setShowAddRecipe(true);
        } else {
            setShowAddRecipe(false);
        }
    }, [user]);
    return (
        <>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>

                <div style={{ display: "flex", gap: "15px" }}>

                    <Link to="login">
                        <Button sx={{ color: "#333" }}>Login</Button>
                    </Link>

                    <Link to="sighnin">
                        <Button sx={{ color: "#333" }}>Sign Up</Button>
                    </Link>

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
            <Recipe />
            <h4>© by tehils shinfeld</h4>
        </>
    );
}
export default Home;