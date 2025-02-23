import { createContext, ReactElement, useContext, useState } from "react";
import { User } from "../moduls/user";

// מבנה הקונטקסט שיכלול את כל הנתונים
type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

// יצירת קונטקסט **ללא ערך ברירת מחדל**
export const UserContext = createContext<UserContextType | undefined>(undefined);

// קומפוננטת הקונטקסט
const UserProvider = ({ children }: { children: ReactElement }) => {
    const [user, setUser] = useState<User>({
        Id: 0,
        Password: "",
        Name: "",
        UserName: "",
        Phone: "",
        Email: "",
        Tz: ""
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// פונקציה בטוחה לשימוש בקונטקסט
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserProvider;
