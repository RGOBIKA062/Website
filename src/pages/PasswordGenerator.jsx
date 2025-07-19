import { useState, useCallback, useEffect } from "react";

export default function PasswordGenerator() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [settings, setSettings] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    // Character variety scoring
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Bonus for very long passwords
    if (password.length >= 20) score++;
    
    // Cap at 4 for our 5-level system (0-4)
    return Math.min(score, 4);
  };

  const getStrengthInfo = (strength) => {
    const levels = [
      { text: 'Very Weak', className: 'weak', width: '20%' },
      { text: 'Weak', className: 'weak', width: '40%' },
      { text: 'Fair', className: 'fair', width: '60%' },
      { text: 'Good', className: 'good', width: '80%' },
      { text: 'Strong', className: 'strong', width: '100%' }
    ];
    return levels[strength] || levels[0];
  };

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similar = 'il1Lo0O';
    const ambiguous = '{}[]()/\\\'"`~,;.<>';

    let charset = '';
    if (settings.includeUppercase) charset += uppercase;
    if (settings.includeLowercase) charset += lowercase;
    if (settings.includeNumbers) charset += numbers;
    if (settings.includeSymbols) charset += symbols;

    if (settings.excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }
    if (settings.excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (charset === '') {
      alert('Please select at least one character type!');
      return;
    }

    let password = '';
    for (let i = 0; i < settings.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    console.log('Generated password:', password); // Debug log
    setGeneratedPassword(password);
    setPasswordStrength(calculateStrength(password));
    setCopySuccess(false);
  }, [settings]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Auto-generate password when component mounts or settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Generate initial password on mount
  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <div className="password-generator-container">
      <div className="generator-header">
        <div className="generator-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <h1>Password Generator</h1>
        <p className="generator-subtitle">Create ultra-secure passwords for all your accounts</p>
      </div>

      <div className="generator-content">
        <div className="password-output">
          <div className="password-display">
            {generatedPassword ? (
              <span className="password-text">{generatedPassword}</span>
            ) : (
              <span className="password-placeholder">Click 'Generate Password' to create a secure password</span>
            )}
            <div className="password-actions">
              <button 
                onClick={copyToClipboard} 
                className="copy-btn"
                disabled={!generatedPassword}
                title="Copy to clipboard"
              >
                {copySuccess ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
              <button 
                onClick={generatePassword} 
                className="generate-btn"
              >
                <svg width="10" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M22.51 15A9 9 0 0 1 5.51 18.36L23 14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Generate
              </button>
            </div>
          </div>
          
          {generatedPassword && (
            <div className="strength-indicator">
              <div className="strength-bar">
                <div 
                  className={`strength-fill ${getStrengthInfo(passwordStrength).className}`}
                ></div>
              </div>
              <span className="strength-text">
                {getStrengthInfo(passwordStrength).text}
              </span>
            </div>
          )}
        </div>

        <div className="generator-settings">
          <h3>Password Settings</h3>
          
          <div className="settings-layout">
            <div className="setting-group">
              <label htmlFor="length">Password Length: {settings.length}</label>
              <input
                type="range"
                id="length"
                min="4"
                max="50"
                value={settings.length}
                onChange={(e) => handleSettingChange('length', parseInt(e.target.value))}
                className="length-slider"
              />
              <div className="range-labels">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <div className="setting-group">
                <h4>Character Types</h4>
                <div className="checkbox-grid">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.includeUppercase}
                      onChange={(e) => handleSettingChange('includeUppercase', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Uppercase Letters (A-Z)
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.includeLowercase}
                      onChange={(e) => handleSettingChange('includeLowercase', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Lowercase Letters (a-z)
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.includeNumbers}
                      onChange={(e) => handleSettingChange('includeNumbers', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Numbers (0-9)
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.includeSymbols}
                      onChange={(e) => handleSettingChange('includeSymbols', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Symbols (!@#$%^&*)
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>Advanced Options</h4>
                <div className="checkbox-grid">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.excludeSimilar}
                      onChange={(e) => handleSettingChange('excludeSimilar', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Exclude Similar Characters (i, l, 1, L, o, 0, O)
                  </label>
                  
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.excludeAmbiguous}
                      onChange={(e) => handleSettingChange('excludeAmbiguous', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Exclude Ambiguous Characters ({`{} [] () /\\ ' " \` ~ , ; . < >`})
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button onClick={generatePassword} className="btn primary generate-main-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Generate Secure Password
          </button>
        </div>
      </div>

      <div className="security-tips">
        <h3>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Security Tips
        </h3>
        <div className="tips-grid">
          <div className="tip">
            <div className="tip-icon">💡</div>
            <p>Use different passwords for each account</p>
          </div>
          <div className="tip">
            <div className="tip-icon">🔒</div>
            <p>Longer passwords are generally more secure</p>
          </div>
          <div className="tip">
            <div className="tip-icon">🔄</div>
            <p>Change passwords regularly, especially for sensitive accounts</p>
          </div>
          <div className="tip">
            <div className="tip-icon">📱</div>
            <p>Consider using a password manager for better security</p>
          </div>
        </div>
      </div>
    </div>
  );
}
