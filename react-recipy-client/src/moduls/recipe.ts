import { Ingrident } from "./ingrident";
import { Instructions } from "./instructions";

export type Rec = {
    Id: number;
    Name: string;
    Img: string;
    Duration: number;
    Difficulty: number;//string?
    Description: string;
    Category: number;
    Instructions: Instructions[];  
    Ingridents: Ingrident[]; 
    UserId:number
};
