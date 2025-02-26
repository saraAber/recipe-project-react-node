import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Category } from "./moduls/category";



const test = () => {
  // const [categoryName, setCategoryName] = useState('');

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   console.log(e);
  //   console.log(categoryName);


  //   try {
  //     const response = await axios.post('http://localhost:8080/api/category', {
  //       name: categoryName,
  //     });
  //     console.log('Category added:', response.data);
  //     setCategoryName('');
  //   } catch (error) {
  //     console.error('Error adding category:', error);
  //   }
  // };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div>
        <h1>Categories</h1>
        <ul>
          {categories.map((category:Category) => (
            // כאן הוספנו את ה-key
            <li key={category.Id}>{category.Name}</li>
          ))}
        </ul>
      </div>
      {/* <div> */}
        {/* <h1>Add Category</h1>
        <form onSubmit={handleSubmit}>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div> */
      }
    </>

  );
};

export default test;

