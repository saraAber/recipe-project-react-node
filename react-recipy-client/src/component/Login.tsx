import axios from "axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, styled } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "../moduls/user";
import { UserContext, useUser } from "../use-context/userProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type SignInData = {
    UserName: string;
    Password: string;
};

const validationSchema = Yup.object({
    UserName: Yup.string().required("שם המשתמש חובה").min(5, "שם המשתמש צריך להיות לפחות 5 תווים"),
    Password: Yup.string().required("הסיסמה חובה").min(8, "הסיסמה צריכה להיות לפחות 8 תווים"),
}).required();
// ============================================
// עיצוב מותאם אישית לשדות הטופס
const CustomTextField = styled(TextField)({
    width: '60%',
    marginBottom: '20px', 
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#444', 
        },
        '&:hover fieldset': {
            borderColor: '#444', 
        },
    },
    '& .MuiInputLabel-root': {
        color: '#444', 
    }
});

const CustomButton = styled(Button)({
    width: '60%', 
    backgroundColor: '#444', 
    color: 'white', 
    padding: '10px 0',
    borderRadius: '8px', 
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', 
    '&:hover': {
        backgroundColor: '#666', 
    },
});
// ============================================

const Login = () => {
    const { setUser, user } = useUser(); 
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<SignInData>({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: SignInData) => {
        logIn(data);
    };

    const logIn = async (data: SignInData) => {
        try {
            const response = await axios.post<User>("http://localhost:8080/api/user/login", {
                UserName: data.UserName,
                Password: data.Password
            });

            if (response && response.data) {
                // הדפסה אם הבקשה הצליחה והמשתמש נמצא
                console.log("✅ התחברות מוצלחת", response.data);
                console.log("User object being set:", {
                    Id: response.data.Id,
                    Password: response.data.Password,
                    Name: response.data.Name,
                    UserName: response.data.UserName,
                    Phone: response.data.Phone,
                    Email: response.data.Email,
                    Tz: response.data.Tz
                });
                setUser({
                    Id: response.data.Id,
                    Password: response.data.Password,
                    Name: response.data.Name,
                    UserName: response.data.UserName,
                    Phone: response.data.Phone,
                    Email: response.data.Email,
                    Tz: response.data.Tz
                });
                // navigate('/home');  
            } else {
                console.error("No data found in response");
            }
            navigate('/home');  // שינוי לדף הבית
            return response.data;
        } catch (error: any) {
            // אם השרת החזיר תשובת שגיאה (401, 400 וכו')
            if (error.response) {
                console.error("Server error:", error.response.status, error.response.data);
            }
            // אם הבקשה בכלל לא הגיעה לשרת (בעיה ברשת למשל)
            else if (error.request) {
                console.error("Network error: No response received from server");
            }
            // כל שגיאה אחרת (בעיה בקוד וכו')
            else {
                console.error("Unexpected error:", error.message);
            }
            return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} justifyContent="center">
            <h2>Login 💬</h2>
            <Grid item xs={12}>
              {/* שדה שם משתמש */}
              <CustomTextField
              
                label="שם משתמש"
                variant="outlined"
                {...register("UserName")}
                error={!!errors.UserName}
                helperText={errors.UserName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              {/* שדה סיסמה */}
              <CustomTextField
                label="סיסמה"
                type="password"
                variant="outlined"
                {...register("Password")}
                error={!!errors.Password}
                helperText={errors.Password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              {/* כפתור שליחה */}
              <CustomButton type="submit" variant="contained">
                הרשמה
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      );
}

export default Login;
