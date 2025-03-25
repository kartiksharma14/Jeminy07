// src/components/ManageClients.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageClients.css';

// Import common layout components
import RecruiterHomeHeader from '../RecruiterHomeHeader';
import RecruiterHomeFooter from '../RecruiterHomeFooter';
import AdminSidebar from './AdminSidebar';

const ManageClients = () => {
  const navigate = useNavigate();

  // ========= CLIENT MANAGEMENT STATES =========
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 10,
    totalItems: 0,
  });
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientError, setClientError] = useState(null);

  // New client form state
  const [newClient, setNewClient] = useState({
    client_name: '',
    address: '',
    contact_person: '',
    email: '',
    phone: ''
  });

  // Client Edit Modal state
  const [showClientEditModal, setShowClientEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  // Client Delete Modal state
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  // ========= SUBSCRIPTION & RECRUITER MODAL (per client) =========
  const [selectedClient, setSelectedClient] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  // Active tab in the modal: 'subscription' or 'recruiters'
  const [activeModalTab, setActiveModalTab] = useState("subscription");

  // ========= SUBSCRIPTION MANAGEMENT STATES =========
  const [subscription, setSubscription] = useState({
    subscription_id: null,
    cv_download_quota: '',
    login_allowed: '',
    start_date: '',
    end_date: '',
    duration_days: '' // This field will be used only for renewals
  });
  
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState(null);
  const [subscriptionEditMode, setSubscriptionEditMode] = useState(false);

  // ========= RECRUITER MANAGEMENT STATES =========
  // Updated newRecruiter state: no company_name now.
  const [newRecruiter, setNewRecruiter] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [recruiters, setRecruiters] = useState([]);
  const [recruitersLoading, setRecruitersLoading] = useState(false);
  const [recruiterError, setRecruiterError] = useState(null);
  const [editingRecruiterId, setEditingRecruiterId] = useState(null);
  const [editingRecruiter, setEditingRecruiter] = useState({
    name: '',
    email: '',
    companyName: '',
    password: ''
  });
  const [showRecruiterEditModal, setShowRecruiterEditModal] = useState(false);
  const [showRecruiterDeleteModal, setShowRecruiterDeleteModal] = useState(false);
  const [recruiterToDelete, setRecruiterToDelete] = useState(null);

  // ========= CLIENT MANAGEMENT FUNCTIONS =========
  const fetchClients = async (page = 1, limit = 10) => {
    setLoadingClients(true);
    setClientError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClients(data.data || []);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          hasNextPage: data.pagination.hasNextPage,
          hasPreviousPage: data.pagination.hasPreviousPage,
          limit: data.pagination.itemsPerPage,
          totalItems: data.pagination.totalItems,
        });
      } else {
        setClientError(data.error || data.message || 'Failed to fetch clients');
      }
    } catch (err) {
      setClientError("Error fetching clients.");
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]);

  const handleNewClientChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newClient)
      });
      const data = await res.json();
      if (data.success) {
        fetchClients(pagination.currentPage, pagination.limit);
        setNewClient({ client_name: '', address: '', contact_person: '', email: '', phone: '' });
        setClientError(null);
      } else {
        setClientError(data.error || data.message);
      }
    } catch (err) {
      setClientError("Error creating client.");
    }
  };

  // Open Client Edit Modal
  const openClientEditModal = (client) => {
    setClientToEdit(client);
    setShowClientEditModal(true);
  };

  const handleClientEditChange = (e) => {
    setClientToEdit({ ...clientToEdit, [e.target.name]: e.target.value });
  };

  const handleSaveClientEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientToEdit.client_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(clientToEdit)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchClients(pagination.currentPage, pagination.limit);
        setShowClientEditModal(false);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error updating client.");
    }
  };

  // Open Client Delete Modal
  const openClientDeleteModal = (client) => {
    setClientToDelete(client);
    setShowClientDeleteModal(true);
  };

  const handleConfirmClientDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientToDelete.client_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchClients(pagination.currentPage, pagination.limit);
        setShowClientDeleteModal(false);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error deleting client.");
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  // ========= SUBSCRIPTION MANAGEMENT FUNCTIONS =========
  const fetchSubscription = async (clientId) => {
    setSubLoading(true);
    setSubError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/subscription`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // API returns subscription inside data.subscription
        if (data.data && data.data.subscription) {
          setSubscription({
            subscription_id: data.data.subscription.subscription_id,
            cv_download_quota: data.data.subscription.cv_download_quota,
            login_allowed: data.data.subscription.login_allowed,
            start_date: data.data.subscription.start_date,
            end_date: data.data.subscription.end_date,
          });
        } else {
          setSubscription({
            subscription_id: null,
            cv_download_quota: '',
            login_allowed: '',
            start_date: '',
            end_date: ''
          });
        }
      } else {
        setSubError(data.error || data.message);
      }
    } catch (err) {
      setSubError("Error fetching subscription.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleSubscriptionChange = (e) => {
    setSubscription({ ...subscription, [e.target.name]: e.target.value });
  };

  const handleSaveSubscription = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("No client selected for subscription.");
      return;
    }
    
    // Determine if the subscription is expired
    const isExpired = new Date(subscription.end_date) < new Date();
  
    let payload = {};
    if (isExpired) {
      // For renewals, send only the renewal fields
      payload = {
        cv_download_quota: subscription.cv_download_quota,
        login_allowed: subscription.login_allowed,
        duration_days: subscription.duration_days, // This field should be updated by the user for renewal
      };
    } else {
      // Regular update: send the full payload with start_date and end_date
      payload = {
        cv_download_quota: subscription.cv_download_quota,
        login_allowed: subscription.login_allowed,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
      };
    }
    
    if (subscription.subscription_id) {
      if (isExpired) {
        // Renew subscription via renew endpoint using POST
        try {
          const res = await fetch(`http://localhost:5000/api/admin/subscriptions/${subscription.subscription_id}/renew`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert("Subscription renewed successfully");
            fetchSubscription(selectedClient.client_id);
            setSubscriptionEditMode(false);
          } else {
            alert(data.error || data.message);
          }
        } catch (err) {
          alert("Error renewing subscription.");
        }
      } else {
        // Regular update subscription
        try {
          const res = await fetch(`http://localhost:5000/api/admin/subscriptions/${subscription.subscription_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert("Subscription updated successfully");
            fetchSubscription(selectedClient.client_id);
            setSubscriptionEditMode(false);
          } else {
            alert(data.error || data.message);
          }
        } catch (err) {
          alert("Error updating subscription.");
        }
      }
    } else {
      // Create new subscription
      try {
        const res = await fetch('http://localhost:5000/api/admin/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify({
            client_id: selectedClient.client_id,
            ...payload
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert("Subscription created successfully");
          fetchSubscription(selectedClient.client_id);
          setSubscriptionEditMode(false);
        } else {
          alert(data.error || data.message);
        }
      } catch (err) {
        alert("Error creating subscription.");
      }
    }
  };
  
  
  

  // When a client is selected for managing subscription & recruiters, open the modal with tabs
  const handleManageSubscription = (client) => {
    setSelectedClient(client);
    fetchSubscription(client.client_id);
    fetchRecruitersForClient(client.client_id);
    setSubscriptionEditMode(false);
    setActiveModalTab("subscription");
    setShowManageModal(true);
  };

  // ========= RECRUITER MANAGEMENT FUNCTIONS =========
  const fetchRecruitersForClient = async (clientId) => {
    setRecruitersLoading(true);
    setRecruiterError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/recruiters`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecruiters(data.recruiters || []);
      } else {
        setRecruiterError(data.error || data.message);
      }
    } catch (err) {
      setRecruiterError("Error fetching recruiters.");
    } finally {
      setRecruitersLoading(false);
    }
  };

  const handleNewRecruiterChange = (e) => {
    setNewRecruiter({ ...newRecruiter, [e.target.name]: e.target.value });
  };

  // Updated to send only email, password, name, and client_id.
  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("Select a client first.");
      return;
    }
    const payload = {
      email: newRecruiter.email,
      password: newRecruiter.password,
      name: newRecruiter.name,
      client_id: selectedClient.client_id
    };
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Recruiter created successfully.");
        fetchRecruitersForClient(selectedClient.client_id);
        setNewRecruiter({ name: '', email: '', password: '' });
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error creating recruiter.");
    }
  };


const handleDeactivateSubscription = async () => {
  if (!subscription.subscription_id) {
    alert("No subscription available to deactivate.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/api/admin/subscriptions/${subscription.subscription_id}/deactivate`, {
      method: 'POST', // or POST/DELETE depending on your API design
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    const data = await res.json();
    if (res.ok && data.success) {
      alert("Subscription deactivated successfully");
      fetchSubscription(selectedClient.client_id);
    } else {
      alert(data.error || data.message);
    }
  } catch (err) {
    alert("Error deactivating subscription.");
  }
};


  // Open recruiter edit modal

  const handleEditRecruiter = (recruiter) => {
    setEditingRecruiterId(recruiter.recruiter_id);
    setEditingRecruiter({
      name: recruiter.name || '',
      email: recruiter.email || '',
      password: ''
    });
    setShowRecruiterEditModal(true);
  };

  const handleEditRecruiterChange = (e) => {
    setEditingRecruiter({ ...editingRecruiter, [e.target.name]: e.target.value });
  };

  const handleSaveEditRecruiter = async (recruiterId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters/${recruiterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editingRecruiter)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRecruitersForClient(selectedClient.client_id);
        setShowRecruiterEditModal(false);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error updating recruiter.");
    }
  };

  // Open delete confirmation modal for recruiter
  const openRecruiterDeleteModal = (recruiter) => {
    setRecruiterToDelete(recruiter.recruiter_id);
    setShowRecruiterDeleteModal(true);
  };

  const performDeleteRecruiter = async (recruiterId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/recruiters/${recruiterId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRecruitersForClient(selectedClient.client_id);
      } else {
        alert(data.error || data.message);
      }
    } catch (err) {
      alert("Error deleting recruiter.");
    }
  };

  // ========= UI RENDERING =========
  const pageSize = pagination.limit;
  const startIndex = (pagination.currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(pagination.currentPage * pageSize, pagination.totalItems);

  return (
    <div className="manage-clients">
      <RecruiterHomeHeader />
      <div className="layout">
        <AdminSidebar />
        <div className="content-recruiter">
          <button className="back-button-recruiter" onClick={() => navigate(-1)}>← Back</button>
          <h2>Manage Clients</h2>

          {/* --- New Client Form --- */}
          <form onSubmit={handleCreateClient} className="client-form">
            <input 
              type="text" 
              name="client_name" 
              placeholder="Client Name" 
              value={newClient.client_name} 
              onChange={handleNewClientChange} 
              required 
            />
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={newClient.address} 
              onChange={handleNewClientChange} 
              required 
            />
            <input 
              type="text" 
              name="contact_person" 
              placeholder="Contact Person" 
              value={newClient.contact_person} 
              onChange={handleNewClientChange} 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={newClient.email} 
              onChange={handleNewClientChange} 
              required 
            />
            <input 
              type="text" 
              name="phone" 
              placeholder="Phone" 
              value={newClient.phone} 
              onChange={handleNewClientChange} 
              required 
            />
            <button type="submit">Create Client</button>
            {clientError && <div className="error">{clientError}</div>}
          </form>

          {/* --- Clients Summary --- */}
          {pagination.totalItems > 0 && (
            <div className="summary">
              <p>
                Showing {startIndex} - {endIndex} of {pagination.totalItems} clients
              </p>
            </div>
          )}

          {/* --- Clients Table --- */}
          <div className="table-container">
            {loadingClients ? (
              <p>Loading clients...</p>
            ) : clients && clients.length > 0 ? (
              <table className="clients-table">
                <thead>
                  <tr>
                    <th className='client-id'>Client ID</th>
                    <th>Client Name</th>
                    <th>Address</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.client_id}>
                      <td>{client.client_id}</td>
                      <td>{client.client_name}</td>
                      <td>{client.address}</td>
                      <td>{client.contact_person}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td className='client-button-table'>
                        <button onClick={() => openClientEditModal(client)}>Edit</button>
                        <button onClick={() => openClientDeleteModal(client)}>Delete</button>
                        <button onClick={() => handleManageSubscription(client)}>Manage Subscription</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No clients found.</p>
            )}
          </div>

          {/* --- Clients Pagination Controls --- */}
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={!pagination.hasPreviousPage}>Previous</button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button onClick={handleNextPage} disabled={!pagination.hasNextPage}>Next</button>
          </div>

          {/* ================= Modal Components ================= */}

          {/* Client Edit Modal */}
          {showClientEditModal && clientToEdit && (
            <div className="client-modal">
              <div className="client-modal-content">
                <div className="modal-header">
                  <h3>Edit Client</h3>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveClientEdit(); }}>
                  <input
                    type="text"
                    name="client_name"
                    placeholder="Client Name"
                    value={clientToEdit.client_name}
                    onChange={handleClientEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={clientToEdit.address}
                    onChange={handleClientEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="contact_person"
                    placeholder="Contact Person"
                    value={clientToEdit.contact_person}
                    onChange={handleClientEditChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={clientToEdit.email}
                    onChange={handleClientEditChange}
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={clientToEdit.phone}
                    onChange={handleClientEditChange}
                    required
                  />
                  <div className="modal-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setShowClientEditModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Client Delete Modal */}
          {showClientDeleteModal && clientToDelete && (
            <div className="client-modal">
              <div className="client-modal-content">
                <span className="client-close" onClick={() => setShowClientDeleteModal(false)}>&times;</span>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete client "{clientToDelete.client_name}"?</p>
                <button onClick={handleConfirmClientDelete}>Yes, Delete</button>
                <button onClick={() => setShowClientDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Main Manage Modal for Subscription & Recruiters */}
          {showManageModal && selectedClient && (
            <div className="sub-client-modal">
              <div className="sub-client-modal-content">
                <span className="sub-client-close" onClick={() => { setShowManageModal(false); setSubscriptionEditMode(false); }}>&times;</span>
                <h3>Manage {selectedClient.client_name}</h3>
                {/* Tab Navigation */}
                <div className="modal-tabs">
                  <button
                    className={activeModalTab === "subscription" ? "active-tab" : ""}
                    onClick={() => setActiveModalTab("subscription")}
                  >
                    Subscription
                  </button>
                  <button
                    className={activeModalTab === "recruiters" ? "active-tab" : ""}
                    onClick={() => setActiveModalTab("recruiters")}
                  >
                    Recruiters
                  </button>
                </div>
                {/* Tab Content */}
                {/* ========= SUBSCRIPTION TAB CONTENT ========= */}
                {/* ========= SUBSCRIPTION TAB CONTENT ========= */}
                {activeModalTab === "subscription" && (
                  <>
                    {subLoading ? (
                      <p>Loading subscription...</p>
                    ) : (
                      <>
                        {subscription && subscription.subscription_id != null && !subscriptionEditMode ? (
                          <div className="subscription-details">
                            <p><strong>CV Download Quota:</strong> {subscription.cv_download_quota}</p>
                            <p><strong>Login Allowed:</strong> {subscription.login_allowed}</p>
                            <p><strong>Start Date:</strong> {subscription.start_date}</p>
                            <p><strong>End Date:</strong> {subscription.end_date}</p>
                            <div className="subscription-actions">
                              <button onClick={() => setSubscriptionEditMode(true)}>
                                {new Date(subscription.end_date) < new Date() ? 'Renew Subscription' : 'Edit Subscription'}
                              </button>
                              <button onClick={handleDeactivateSubscription}>Deactivate Subscription</button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSaveSubscription} className="subscription-form">
                            <input
                              type="number"
                              name="cv_download_quota"
                              placeholder="CV Download Quota"
                              value={subscription.cv_download_quota}
                              onChange={handleSubscriptionChange}
                              required
                            />
                            <input
                              type="number"
                              name="login_allowed"
                              placeholder="Login Allowed"
                              value={subscription.login_allowed}
                              onChange={handleSubscriptionChange}
                              required
                            />
                            {new Date(subscription.end_date) < new Date() ? (
                              // Renewal mode: Only show duration_days
                              <input
                                type="number"
                                name="duration_days"
                                placeholder="Duration (Days)"
                                value={subscription.duration_days}
                                onChange={handleSubscriptionChange}
                                required
                              />
                            ) : (
                              // Active subscription: Show start and end date fields for editing
                              <>
                                <input
                                  type="date"
                                  name="start_date"
                                  value={subscription.start_date}
                                  onChange={handleSubscriptionChange}
                                  required
                                />
                                <input
                                  type="date"
                                  name="end_date"
                                  value={subscription.end_date}
                                  onChange={handleSubscriptionChange}
                                  required
                                />
                              </>
                            )}
                            <div className="subscription-form-actions">
                              <button type="submit">
                                {subscription.subscription_id ? 'Update Subscription' : 'Create Subscription'}
                              </button>
                              <button type="button" onClick={() => setSubscriptionEditMode(false)}>
                                Cancel
                              </button>
                            </div>
                            {subError && <div className="error">{subError}</div>}
                          </form>
                        )}
                      </>
                    )}
                  </>
                )}
                {activeModalTab === "recruiters" && (
                  <>
                    <form onSubmit={handleCreateRecruiter} className="recruiter-form">
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Recruiter Name" 
                        value={newRecruiter.name} 
                        onChange={handleNewRecruiterChange} 
                        required 
                      />
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Recruiter Email" 
                        value={newRecruiter.email} 
                        onChange={handleNewRecruiterChange} 
                        required 
                      />
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={newRecruiter.password} 
                        onChange={handleNewRecruiterChange} 
                        required 
                      />
                      <button type="submit">Create Recruiter</button>
                    </form>
                    {recruitersLoading ? (
                      <p>Loading recruiters...</p>
                    ) : recruiterError ? (
                      <p className="error">{recruiterError}</p>
                    ) : recruiters && recruiters.length > 0 ? (
                      <table className="recruiters-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recruiters.map((rec) => (
                            <tr key={rec.recruiter_id}>
                              <td>{rec.name || 'N/A'}</td>
                              <td>{rec.email || 'N/A'}</td>
                              <td className='client-button-table'>
                                <button onClick={() => handleEditRecruiter(rec)}>Edit</button>
                                <button onClick={() => { setRecruiterToDelete(rec.recruiter_id); setShowRecruiterDeleteModal(true); }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No recruiters found for this client.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Recruiter Edit Modal */}
          {showRecruiterEditModal && (
            <div className="sub-client-modal">
              <div className="sub-client-modal-content">
                <span className="sub-client-close" onClick={() => setShowRecruiterEditModal(false)}>&times;</span>
                <h3>Edit Recruiter</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSaveEditRecruiter(editingRecruiterId); }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Recruiter Name"
                    value={editingRecruiter.name}
                    onChange={handleEditRecruiterChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Recruiter Email"
                    value={editingRecruiter.email}
                    onChange={handleEditRecruiterChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank if no change"
                    value={editingRecruiter.password}
                    onChange={handleEditRecruiterChange}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setShowRecruiterEditModal(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}

          {/* Recruiter Delete Confirmation Modal */}
          {showRecruiterDeleteModal && (
            <div className="sub-client-modal">
              <div className="sub-client-modal-content">
                <span className="sub-client-close" onClick={() => setShowRecruiterDeleteModal(false)}>&times;</span>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this recruiter?</p>
                <button onClick={async () => { await performDeleteRecruiter(recruiterToDelete); setShowRecruiterDeleteModal(false); }}>
                  Yes, Delete
                </button>
                <button onClick={() => setShowRecruiterDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          )}

        </div>
      </div>
      <RecruiterHomeFooter />
    </div>
  );
};

export default ManageClients;
