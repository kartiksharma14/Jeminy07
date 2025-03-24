// src/components/ManageRecruiters.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageRecruiters.css';

// Import header, footer, and sidebar components
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const ManageRecruiters = () => {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState(null);
  const [newRecruiter, setNewRecruiter] = useState({
    email: '',
    password: '',
    name: '',
    company_name: ''
  });

  const handleInputChange = (e) => {
    setNewRecruiter({
      ...newRecruiter,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/recruiters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newRecruiter)
      });
      const data = await res.json();
      if (data.success) {
        setRecruiters([...recruiters, data.recruiter]);
        setNewRecruiter({
          email: '',
          password: '',
          name: '',
          company_name: ''
        });
        setError(null);
      } else {
        setError(data.error || data.message);
      }
    } catch (err) {
      setError("Error creating recruiter.");
    }
  };

  // Dummy edit handler – implement actual edit logic as needed.
  const handleEditRecruiter = (recruiter) => {
    alert(`Edit recruiter: ${recruiter.name}`);
    // For example, navigate to an edit page:
    // navigate(`/admin/recruiters/edit/${recruiter.id}`, { state: { recruiter } });
  };

  // Dummy delete handler – implement actual delete logic as needed.
  const handleDeleteRecruiter = async (recruiterId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recruiter?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters/${recruiterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setRecruiters(recruiters.filter(r => r.id !== recruiterId));
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error deleting recruiter.");
    }
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mr-manage-recruiters">
      <RecruiterHomeHeader />
      <div className="mr-layout">
        <AdminSidebar />
        <div className="mr-content">
          <div className="mr-container">
            <button className="mr-back-button" onClick={handleBack}>← Back</button>
            <h2 className="mr-title">Manage Recruiters</h2>
            <form onSubmit={handleCreateRecruiter} className="mr-form">
              <input 
                type="text" 
                name="name" 
                placeholder="Recruiter Name" 
                value={newRecruiter.name} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Recruiter Email" 
                value={newRecruiter.email} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={newRecruiter.password} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="text" 
                name="company_name" 
                placeholder="Company Name" 
                value={newRecruiter.company_name} 
                onChange={handleInputChange} 
                required 
              />
              <button type="submit">Create Recruiter</button>
              {error && <div className="mr-error">{error}</div>}
            </form>
            <div className="mr-table-container">
              {recruiters.length > 0 ? (
                <table className="mr-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Company</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recruiters.map((rec, idx) => (
                      <tr key={idx}>
                        <td>{rec.name}</td>
                        <td>{rec.email}</td>
                        <td>{rec.company_name}</td>
                        <td>
                          <button 
                            className="mr-action-btn edit-btn" 
                            onClick={() => handleEditRecruiter(rec)}
                          >
                            Edit
                          </button>
                          <button 
                            className="mr-action-btn delete-btn" 
                            onClick={() => handleDeleteRecruiter(rec.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mr-no-data">No recruiters found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default ManageRecruiters;
