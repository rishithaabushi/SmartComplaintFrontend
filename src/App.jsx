import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/complaints",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();
      setMessage(`Complaint submitted successfully! ID: ${data.id}`);
      setForm({ name: "", email: "", subject: "", description: "" });
      loadComplaints();
    } catch (error) {
      setMessage(
        "Unable to submit. Check whether Spring Boot is running and CORS is configured."
      );
    }
  };

  const loadComplaints = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/complaints"
      );
      if (!response.ok) throw new Error("Could not load complaints");
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error loading complaints:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Smart Complaint Management System</h1>
        <p>Submit and track your complaints easily</p>
      </header>

      <main className="container">
        <section className="card">
          <h2>Submit a Complaint</h2>

          <form onSubmit={submitComplaint}>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Subject</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter complaint subject"
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your complaint"
              rows="4"
              required
            />

            <button type="submit">Submit Complaint</button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="card">
          <h2>All Complaints</h2>
          <button type="button" onClick={loadComplaints}>
            View Complaints
          </button>

          {complaints.map((complaint) => (
            <div className="complaint" key={complaint.id}>
              <h3>Complaint #{complaint.id}</h3>
              <p><strong>Name:</strong> {complaint.name}</p>
              <p><strong>Subject:</strong> {complaint.subject}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;