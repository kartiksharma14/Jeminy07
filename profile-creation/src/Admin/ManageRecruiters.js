// src/components/ManageRecruiters.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageRecruiters.css';

// Import header, footer, and sidebar components
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const ManageRecruiters = () => {
  const navigate = useNavigate();

  // State for recruiter list and pagination
  const [recruiters, setRecruiters] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5,       // default page size
    totalCount: 0,  // total recruiters
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for creating a new recruiter
  const [newRecruiter, setNewRecruiter] = useState({
    email: '',
    password: '',
    name: '',
    // For creation, the API expects the field as company_name
    company_name: ''
  });

  // State for editing a recruiter
  // We'll store the edit state using "companyName" (camelCase) for the PATCH request.
  const [editingRecruiterId, setEditingRecruiterId] = useState(null);
  const [editingRecruiter, setEditingRecruiter] = useState({
    name: '',
    email: '',
    companyName: '', // will be mapped from fetched company_name
    password: ''
  });

  // Fetch recruiters with pagination (limit 5 per page)
  const fetchRecruiters = async (page = 1, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecruiters(data.data); // API returns "company_name"
        // Assume the API sends a pagination object including totalCount and limit.
        setPagination(data.pagination);
      } else {
        setError(data.error || data.message || 'Failed to fetch recruiters');
      }
    } catch (err) {
      setError("Error fetching recruiters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters(pagination.currentPage, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // Calculate dynamic summary indices based on pagination.
  // Using pagination.limit as pageSize.
  const pageSize = pagination.limit || 5;
  const startIndex = (pagination.currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(pagination.currentPage * pageSize, pagination.totalCount);

  // Handle new recruiter creation
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
        // Refresh list after creation
        fetchRecruiters(pagination.currentPage, pagination.limit);
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

  // Handle edit input change
  const handleEditInputChange = (e) => {
    setEditingRecruiter({
      ...editingRecruiter,
      [e.target.name]: e.target.value
    });
  };

  // Start editing a recruiter – map fetched "company_name" to "companyName"
  const handleEditRecruiter = (recruiter) => {
    setEditingRecruiterId(recruiter.recruiter_id);
    setEditingRecruiter({
      name: recruiter.name || '',
      email: recruiter.email || '',
      // Map the fetched field "company_name" to "companyName"
      companyName: recruiter.company_name || '',
      password: '' // Leave blank if no change
    });
  };

  // Save edited recruiter details via PATCH
  // PATCH expects the payload key "companyName"
  const handleSaveEdit = async (recruiterId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters/${recruiterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        // Send companyName from editingRecruiter state
        body: JSON.stringify(editingRecruiter)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRecruiters(pagination.currentPage, pagination.limit);
        setEditingRecruiterId(null);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error updating recruiter.");
    }
  };

  // Delete recruiter
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
      if (res.ok && data.success) {
        fetchRecruiters(pagination.currentPage, pagination.limit);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error deleting recruiter.");
    }
  };

  // Back button
  const handleBack = () => {
    navigate(-1);
  };

  // Pagination controls
  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
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

            {/* Create Recruiter Form */}
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

            {/* Dynamic Summary */}
            {pagination.totalCount > 0 && (
              <div className="mr-summary">
                <p>
                  Showing {startIndex} - {endIndex} of {pagination.totalCount} recruiters
                </p>
              </div>
            )}

            {/* Recruiters Table */}
            <div className="mr-table-container">
              {loading ? (
                <p>Loading recruiters...</p>
              ) : recruiters.length > 0 ? (
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
                    {recruiters.map((rec) => (
                      <tr key={rec.recruiter_id}>
                        <td>
                          {editingRecruiterId === rec.recruiter_id ? (
                            <input
                              type="text"
                              name="name"
                              value={editingRecruiter.name}
                              onChange={handleEditInputChange}
                            />
                          ) : (
                            rec.name || "N/A"
                          )}
                        </td>
                        <td>
                          {editingRecruiterId === rec.recruiter_id ? (
                            <input
                              type="email"
                              name="email"
                              value={editingRecruiter.email}
                              onChange={handleEditInputChange}
                            />
                          ) : (
                            rec.email || "N/A"
                          )}
                        </td>
                        <td>
                          {editingRecruiterId === rec.recruiter_id ? (
                            <input
                              type="text"
                              name="companyName"
                              value={editingRecruiter.companyName}
                              onChange={handleEditInputChange}
                            />
                          ) : (
                            rec.company_name || "N/A"
                          )}
                        </td>
                        <td>
                          {editingRecruiterId === rec.recruiter_id ? (
                            <>
                              <button 
                                className="mr-action-btn save-btn" 
                                onClick={() => handleSaveEdit(rec.recruiter_id)}
                              >
                                Save
                              </button>
                              <button 
                                className="mr-action-btn cancel-btn" 
                                onClick={() => setEditingRecruiterId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="mr-action-btn edit-btn" 
                                onClick={() => handleEditRecruiter(rec)}
                              >
                                Edit
                              </button>
                              <button 
                                className="mr-action-btn delete-btn" 
                                onClick={() => handleDeleteRecruiter(rec.recruiter_id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mr-no-data">No recruiters found.</p>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="mr-pagination">
              <button onClick={handlePrevPage} disabled={!pagination.hasPreviousPage}>
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button onClick={handleNextPage} disabled={!pagination.hasNextPage}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default ManageRecruiters;
