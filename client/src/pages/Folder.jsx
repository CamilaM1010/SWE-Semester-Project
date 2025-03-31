import { useLocation} from "react-router-dom";
import {api} from "../utils/api";
import { useState, useEffect} from "react";

const Folder = () => {
    const location = useLocation();
    console.log("Location state:", location.state);
    const folder = location.state || { name: "Loading...", notes: [] }; // Default if no folder is passed
  
    console.log("Folder data:", folder);
    console.log("Folder ID:", folder._id);


    return(
    <div style={{ 
        backgroundColor: "#EBF5FF", 
        minHeight: "100vh",
        padding: "20px"
      }}>
        <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "linear-gradient(90deg, #0021A5 0%, #17a2b8 100%)",
              padding: "20px 30px",
              borderRadius: "12px",
              marginBottom: "30px",
              boxShadow: "0 4px 6px #2c3e50"
            }}>
              <div>
                <h1 style={{ 
                  fontSize: "28px", 
                  color: "white", 
                  margin: "0 0 5px 0",
                  display: "flex",
                  alignItems: "center"
                }}>
                  The Archaeological Archives <span style={{ marginLeft: "10px" }}>🦖</span>
                </h1>
                <p style={{ 
                  color: "#17a2b8", 
                  margin: "0",
                  fontSize: "16px"
                }}>
                  All notes stored in "{folder? folder.name : "loading..."}" folder
                </p>
                </div>
            </div>
        </div>
    </div>

    );
};
export default Folder;