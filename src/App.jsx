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

  const API_URL =
    "https://smartcomplaintbackend.onrender.com/api/complaints";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setMessage(
        `Complaint submitted successfully! ID: ${data.id}`
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        description: "",
      });

      await loadComplaints();
    } catch (error) {
      console.error("Error submitting complaint:", error);

      setMessage(
        `Unable to submit complaint. ${error.message || "Please check the backend connection."}`
      );
    }
  };

  const loadComplaints = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Could not load complaints. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setMessage("Unable to load complaints. Please try again.");
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
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter complaint subject"
              required
            />

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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

          {complaints.length === 0 ? (
            <p>No complaints to display. Click "View Complaints" to refresh.</p>
          ) : (
            complaints.map((complaint) => (
              <div className="complaint" key={complaint.id}>
                <h3>Complaint #{complaint.id}</h3>

                <p>
                  <strong>Name:</strong> {complaint.name}
                </p>

                <p>
                  <strong>Subject:</strong> {complaint.subject}
                </p>

                <p>
                  <strong>Status:</strong> {complaint.status}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;