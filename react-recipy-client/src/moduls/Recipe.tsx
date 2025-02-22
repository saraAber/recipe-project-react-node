import { Ingrident } from "./Ingrident";

export type Rec = {
    Id: number;
    Name: string;
    Img: string;
    Duration: number;
    Difficulty: number;
    Description: string;
    Instructions: string;  
    Ingridents: Ingrident[]; // לשנות את השם כמו שמגיע מהשרת
    UserId:number
};
