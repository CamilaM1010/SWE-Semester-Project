import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const CornellTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const note = location.state?.note || { title: "", questions: "", notes: "", summary: "" };

  const [title, setTitle] = useState(note.title);
  const [header, setHeader] = useState(note.header);
  const [notes, setNotes] = useState(note.notes);
  const [summary, setSummary] = useState(note.summary);

  const handleSave = async () => {
    const noteData = { title, header, notes, summary };

    try {
      if (note._id) {
        await fetch(`/api/notes/${note._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }
      navigate("/private");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#EBF5FF", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          backgroundColor: "#0021A5",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 4px 6px #2c3e50"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              color: "white", 
              margin: 0, 
              display: "flex",
              alignItems: "center"
            }}>
              DyNotes 🦖
            </h1>
            <p style={{ color: "#17a2b8", margin: "4px 0 0 0" }}>Prehistoric note-taking</p>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#FA4616",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px #2c3e50"
              }}
            >
              Save
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ 
              fontSize: "18px", 
              fontWeight: "bold", 
              color: "#0021A5"
            }}>
              Note Title
            </label>
            <span style={{ 
              marginLeft: "8px", 
              fontSize: "12px", 
              color: "#FA4616"
            }}>
              🦕 Make it prehistoric!
            </span>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "3px solid #0021A5",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>
        
        <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
          <div style={{ flex: "1", maxWidth: "33%" }}>
            <div style={{ 
              backgroundColor: "#0021A5", 
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              textAlign: "center"
            }}>
              <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>
                Main Ideas
                <span style={{ 
                  marginLeft: "8px", 
                  fontSize: "12px", 
                  color: "#17a2b8"
                }}>
                  Dino Tracks
                </span>
              </h2>
            </div>
            <textarea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Record main concepts here..."
              style={{
                width: "100%",
                height: "300px",
                padding: "12px",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                border: "3px solid #0021A5",
                borderTop: "none",
                boxSizing: "border-box",
                resize: "none"
              }}
            ></textarea>
          </div>
          
          <div style={{ flex: "2", maxWidth: "67%" }}>
            <div style={{ 
              backgroundColor: "#FA4616", 
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              textAlign: "center"
            }}>
              <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>
                Notes
                <span style={{ 
                  marginLeft: "8px", 
                  fontSize: "12px", 
                  color: "#f8f9fa"
                }}>
                  Fossil Records
                </span>
              </h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Document your detailed observations here..."
              style={{
                width: "100%",
                height: "300px",
                padding: "12px",
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                border: "3px solid #FA4616",
                borderTop: "none",
                boxSizing: "border-box",
                resize: "none"
              }}
            ></textarea>
          </div>
        </div>
        
        <div>
          <div style={{ 
            background: "linear-gradient(90deg, #0021A5 0%, #FA4616 100%)", 
            color: "white",
            padding: "10px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            textAlign: "center"
          }}>
            <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>
              Summary
              <span style={{ 
                marginLeft: "8px", 
                fontSize: "12px", 
                color: "#f8f9fa"
              }}>
                Extinction-Proof Insights
              </span>
            </h2>
          </div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Summarize your key learnings here..."
            style={{
              width: "100%",
              height: "120px",
              padding: "12px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              border: "linear-gradient(90deg, #0021A5 0%, #FA4616 100%)",
              borderRight: "3px solid #FA4616",
              borderTop: "none",
              boxSizing: "border-box",
              resize: "none"
            }}
          ></textarea>
        </div>
        
        <div style={{ 
          marginTop: "24px", 
          textAlign: "center"
        }}>
          <div style={{ 
            display: "inline-block",
            background: "linear-gradient(90deg, #0021A5 0%, #FA4616 100%)",
            padding: "8px 16px",
            borderRadius: "24px",
            color: "white",
            fontWeight: "bold"
          }}>
            DyNotes: Taking notes that will stand the test of time 🦖
          </div>
        </div>
      </div>
    </div>
  );
};

export default CornellTemplate;
