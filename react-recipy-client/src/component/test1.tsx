import React, { useState } from "react";
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Box, Paper, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRecipes } from "../use-context/recipesProvider";

const categories = [
    { id: 1, name: "חלבי" },
    { id: 2, name: "בשרי" },
    { id: 3, name: "פרווה" },
];

const difficulties = [
    { id: 1, name: "קל" },
    { id: 2, name: "בינוני" },
    { id: 3, name: "קשה" },
];

const Test1 = () => {
    const [filterType, setFilterType] = useState(""); // סוג הסינון שנבחר
    const [filterValue, setFilterValue] = useState(""); // הערך שנבחר לסינון
    const [openSearch, setOpenSearch] = useState(false); // מציין אם התיבה פתוחה או סגורה
  const { recipes, setRecipes } = useRecipes();

    const filterRecipes = () => {
        return recipes.filter((recipe) => {
            // if (filterType === "category" && filterValue) {
            //     return recipe.Category === Number(filterValue);
            // }
            console.log(recipe?.Difficulty ,filterValue);
            
            if (filterType === "difficulty" && filterValue) {
                return String(recipe?.Difficulty)=== String(filterValue);
            }
            if (filterType === "duration" && filterValue) {
                return recipe?.Duration <= Number(filterValue);
            }
            if (filterType === "createdBy" && filterValue) {
                return recipe?.UserId === Number(filterValue);
            }
            return true;
        });
    };

    const handleSearch = () => {
        const filteredRecipes = filterRecipes();
        setRecipes(filteredRecipes);
        filteredRecipes.length === 0 &&alert("לא נמצאו מתכונים מתאימים לחיפוש");
        
        console.log("מתכונים מפולטרים:", filteredRecipes);
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenSearch(!openSearch)}
                sx={{
                    mb: 3,
                    fontWeight: "bold",
                    borderRadius: 2,
                    transition: "0.3s",
                    "&:hover": { backgroundColor: "#444", color: "#fff" },
                    borderColor: "#444", // אפור כהה
                }}
            >
                {openSearch ? "סגור חיפוש" : "אפשר חיפוש"}
            </Button>
            {openSearch && (
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f5f5f5", maxWidth: 400, mx: "auto" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>🔎 חיפוש מתכונים</Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>בחר סינון</InputLabel>
                        <Select value={filterType} onChange={(e) => { setFilterType(e.target.value); setFilterValue(""); }}>
                            <MenuItem value="category">קטגוריה</MenuItem>
                            <MenuItem value="duration">משך זמן</MenuItem>
                            <MenuItem value="difficulty">רמת קושי</MenuItem>
                            <MenuItem value="createdBy">נוצר ע"י</MenuItem>
                        </Select>
                    </FormControl>

                    {filterType === "category" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>בחר קטגוריה</InputLabel>
                            <Select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {filterType === "difficulty" && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>בחר רמת קושי</InputLabel>
                            <Select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                                {difficulties.map((diff) => (
                                    <MenuItem key={diff.id} value={diff.name}>{diff.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    {filterType === "duration" && (
                        <TextField
                            fullWidth
                            type="number"
                            label="משך זמן (דקות)"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    )}
                    {filterType === "createdBy" && (
                        <TextField
                            fullWidth
                            label="שם יוצר המתכון"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        disabled={!filterType || !filterValue}
                        sx={{
                            fontWeight: "bold",
                            borderRadius: 2,
                            transition: "0.3s",
                            backgroundColor: "#444", // אפור כהה
                            "&:hover": { backgroundColor: "#333" }, // גוון כהה יותר בהובר
                            "&:disabled": { backgroundColor: "#ccc" },
                        }}
                    >
                        חפש
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default Test1;