import { useState, useEffect } from "react";

export default function PasswordManager() {
  const [passwords, setPasswords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    email: '',
    password: '',
    notes: '',
    category: 'general'
  });

  // Load passwords from localStorage on component mount
  useEffect(() => {
    const savedPasswords = localStorage.getItem('savedPasswords');
    if (savedPasswords) {
      setPasswords(JSON.parse(savedPasswords));
    }
  }, []);

  // Save passwords to localStorage whenever passwords array changes
  useEffect(() => {
    localStorage.setItem('savedPasswords', JSON.stringify(passwords));
  }, [passwords]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateRandomPassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPassword) {
      setPasswords(passwords.map(p => 
        p.id === editingPassword.id 
          ? { ...formData, id: editingPassword.id, createdAt: editingPassword.createdAt, updatedAt: new Date().toISOString() }
          : p
      ));
      setEditingPassword(null);
    } else {
      const newPassword = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setPasswords([...passwords, newPassword]);
    }
    
    setFormData({
      website: '',
      username: '',
      email: '',
      password: '',
      notes: '',
      category: 'general'
    });
    setShowAddForm(false);
  };

  const deletePassword = (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      setPasswords(passwords.filter(p => p.id !== id));
    }
  };

  const editPassword = (password) => {
    setFormData(password);
    setEditingPassword(password);
    setShowAddForm(true);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredPasswords = passwords.filter(password =>
    password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWebsiteIcon = (website) => {
    const domain = website.replace(/^https?:\/\//, '').split('/')[0];
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '🌐',
      social: '📱',
      work: '💼',
      banking: '🏦',
      shopping: '🛒',
      entertainment: '🎮'
    };
    return icons[category] || '🌐';
  };

  return (
    <div className="password-manager-container">
      <div className="manager-header">
        <div className="header-content">
          <div className="manager-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h1>Password Manager</h1>
            <p>Securely store and manage all your passwords</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingPassword(null);
              setFormData({
                website: '', username: '', email: '', password: '', notes: '', category: 'general'
              });
            }}
            className="btn primary add-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Add Password
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="password-form-modal">
            <div className="modal-header">
              <h2>{editingPassword ? 'Edit Password' : 'Add New Password'}</h2>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPassword(null);
                }}
                className="close-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="password-form">
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="website">Website/Service</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="example.com"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="social">Social Media</option>
                    <option value="work">Work</option>
                    <option value="banking">Banking</option>
                    <option value="shopping">Shopping</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Your username"
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter or generate password"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="generate-password-btn"
                    title="Generate random password"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingPassword ? 'Update Password' : 'Save Password'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPassword(null);
                  }}
                  className="btn secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="passwords-grid">
        {filteredPasswords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" fill="currentColor"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>No passwords found</h3>
            <p>Add your first password to get started with secure storage.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn primary"
            >
              Add Your First Password
            </button>
          </div>
        ) : (
          filteredPasswords.map((password) => (
            <div key={password.id} className="password-card">
              <div className="card-header">
                <div className="website-info">
                  <div className="website-icon">
                    <img 
                      src={getWebsiteIcon(password.website)} 
                      alt=""
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="fallback-icon" style={{display: 'none'}}>
                      {getCategoryIcon(password.category)}
                    </div>
                  </div>
                  <div className="website-details">
                    <h3>{password.website}</h3>
                    <span className="category-badge">{password.category}</span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button
                    onClick={() => editPassword(password)}
                    className="action-btn edit-btn"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => deletePassword(password.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="card-content">
                {password.username && (
                  <div className="credential-row">
                    <span className="label">Username:</span>
                    <div className="credential-value">
                      <span>{password.username}</span>
                      <button
                        onClick={() => copyToClipboard(password.username)}
                        className="copy-btn-small"
                        title="Copy username"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {password.email && (
                  <div className="credential-row">
                    <span className="label">Email:</span>
                    <div className="credential-value">
                      <span>{password.email}</span>
                      <button
                        onClick={() => copyToClipboard(password.email)}
                        className="copy-btn-small"
                        title="Copy email"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="credential-row">
                  <span className="label">Password:</span>
                  <div className="credential-value">
                    <span className="password-display">
                      {showPassword[password.id] ? password.password : '••••••••••••'}
                    </span>
                    <div className="password-actions">
                      <button
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="toggle-btn"
                        title={showPassword[password.id] ? "Hide password" : "Show password"}
                      >
                        {showPassword[password.id] ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(password.password)}
                        className="copy-btn-small"
                        title="Copy password"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {password.notes && (
                  <div className="notes-section">
                    <span className="label">Notes:</span>
                    <p className="notes-text">{password.notes}</p>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="date-info">
                  Created: {new Date(password.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
