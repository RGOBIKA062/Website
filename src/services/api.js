// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Get user data from localStorage
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Set user data in localStorage
const setUserData = (data) => {
  localStorage.setItem('userData', JSON.stringify(data));
};

// Get passwords from localStorage
const getPasswordsData = () => {
  const passwords = localStorage.getItem('passwords');
  return passwords ? JSON.parse(passwords) : [];
};

// Set passwords in localStorage
const setPasswordsData = (passwords) => {
  localStorage.setItem('passwords', JSON.stringify(passwords));
};

// Generate random token
const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Generate random ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const { username, email, password, masterPassword } = userData;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(user => user.email === email || user.username === username);
    
    if (userExists) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: generateId(),
      username,
      email,
      masterPassword, // In real app, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    // Generate and store token
    const token = generateToken();
    setAuthToken(token);
    setUserData({ id: newUser.id, username, email });
    
    return {
      success: true,
      data: { token, user: { id: newUser.id, username, email } },
      message: 'User registered successfully'
    };
  },

  // Login user
  login: async (credentials) => {
    const { email, password, masterPassword } = credentials;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user || user.masterPassword !== masterPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Generate and store token
    const token = generateToken();
    setAuthToken(token);
    setUserData({ id: user.id, username: user.username, email: user.email });
    
    return {
      success: true,
      data: { token, user: { id: user.id, username: user.username, email: user.email } },
      message: 'Login successful'
    };
  },

  // Get current user
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    if (!userData) {
      throw new Error('User data not found');
    }
    
    return {
      success: true,
      data: { user: userData },
      message: 'User data retrieved'
    };
  },

  // Update user profile
  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const updatedUser = { ...userData, ...profileData };
    setUserData(updatedUser);
    
    return {
      success: true,
      data: { user: updatedUser },
      message: 'Profile updated successfully'
    };
  },

  // Change password
  changePassword: async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  },

  // Change master password
  changeMasterPassword: async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex !== -1) {
      users[userIndex].masterPassword = passwordData.newMasterPassword;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    return {
      success: true,
      message: 'Master password changed successfully'
    };
  },

  // Logout
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    removeAuthToken();
    localStorage.removeItem('userData');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Password Management API
export const passwordAPI = {
  // Get all passwords
  getPasswords: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    let passwords = getPasswordsData().filter(p => p.userId === userData.id);
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      passwords = passwords.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.website.toLowerCase().includes(searchLower) ||
        p.username.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.category) {
      passwords = passwords.filter(p => p.category === filters.category);
    }
    
    if (filters.isFavorite === 'true') {
      passwords = passwords.filter(p => p.isFavorite);
    }
    
    // Sort passwords
    passwords.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    return {
      success: true,
      data: { passwords },
      message: 'Passwords retrieved successfully'
    };
  },

  // Get specific password (requires master password)
  getPassword: async (id, masterPassword) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    // Verify master password
    const userData = getUserData();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userData.id);
    
    if (!user || user.masterPassword !== masterPassword) {
      throw new Error('Invalid master password');
    }
    
    const passwords = getPasswordsData();
    const password = passwords.find(p => p.id === id && p.userId === userData.id);
    
    if (!password) {
      throw new Error('Password not found');
    }
    
    return {
      success: true,
      data: { password },
      message: 'Password retrieved successfully'
    };
  },

  // Create new password
  createPassword: async (passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const newPassword = {
      id: generateId(),
      userId: userData.id,
      ...passwordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const passwords = getPasswordsData();
    passwords.push(newPassword);
    setPasswordsData(passwords);
    
    return {
      success: true,
      data: { password: newPassword },
      message: 'Password created successfully'
    };
  },

  // Update password
  updatePassword: async (id, passwordData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const passwords = getPasswordsData();
    const passwordIndex = passwords.findIndex(p => p.id === id && p.userId === userData.id);
    
    if (passwordIndex === -1) {
      throw new Error('Password not found');
    }
    
    passwords[passwordIndex] = {
      ...passwords[passwordIndex],
      ...passwordData,
      updatedAt: new Date().toISOString()
    };
    
    setPasswordsData(passwords);
    
    return {
      success: true,
      data: { password: passwords[passwordIndex] },
      message: 'Password updated successfully'
    };
  },

  // Delete password
  deletePassword: async (id, masterPassword) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    // Verify master password
    const userData = getUserData();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userData.id);
    
    if (!user || user.masterPassword !== masterPassword) {
      throw new Error('Invalid master password');
    }
    
    const passwords = getPasswordsData();
    const filteredPasswords = passwords.filter(p => !(p.id === id && p.userId === userData.id));
    
    if (passwords.length === filteredPasswords.length) {
      throw new Error('Password not found');
    }
    
    setPasswordsData(filteredPasswords);
    
    return {
      success: true,
      message: 'Password deleted successfully'
    };
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const passwords = getPasswordsData();
    const passwordIndex = passwords.findIndex(p => p.id === id && p.userId === userData.id);
    
    if (passwordIndex === -1) {
      throw new Error('Password not found');
    }
    
    passwords[passwordIndex].isFavorite = !passwords[passwordIndex].isFavorite;
    passwords[passwordIndex].updatedAt = new Date().toISOString();
    setPasswordsData(passwords);
    
    return {
      success: true,
      data: { password: passwords[passwordIndex] },
      message: 'Favorite status updated'
    };
  },

  // Get password statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    const userData = getUserData();
    const passwords = getPasswordsData().filter(p => p.userId === userData.id);
    
    const stats = {
      totalPasswords: passwords.length,
      favoritePasswords: passwords.filter(p => p.isFavorite).length,
      categories: [...new Set(passwords.map(p => p.category))].length,
      weakPasswords: passwords.filter(p => p.password && p.password.length < 8).length
    };
    
    return {
      success: true,
      data: { stats },
      message: 'Statistics retrieved successfully'
    };
  },

  // Bulk delete passwords
  bulkDelete: async (passwordIds, masterPassword) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!getAuthToken()) {
      throw new Error('Not authenticated');
    }
    
    // Verify master password
    const userData = getUserData();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userData.id);
    
    if (!user || user.masterPassword !== masterPassword) {
      throw new Error('Invalid master password');
    }
    
    const passwords = getPasswordsData();
    const filteredPasswords = passwords.filter(p => 
      !(passwordIds.includes(p.id) && p.userId === userData.id)
    );
    
    setPasswordsData(filteredPasswords);
    
    return {
      success: true,
      message: `${passwordIds.length} passwords deleted successfully`
    };
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      data: { status: 'healthy' },
      message: 'Service is healthy'
    };
  },
};

// Export token management functions
export { getAuthToken, setAuthToken, removeAuthToken };
