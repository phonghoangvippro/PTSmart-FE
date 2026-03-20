const API_BASE_URL = 'http://192.168.0.243:8000';

export const getSettings = async () => {
  let response = await fetch(`${API_BASE_URL}/api/settings`, {
    headers: { 'Accept': 'application/json' }
  });
  
  // If public endpoint not found, let's try the admin one the user mentioned
  if (!response.ok) {
    response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      headers: { 'Accept': 'application/json' }
    });
  }

  if (!response.ok) throw new Error('Failed to load settings');
  const result = await response.json();
  return result.data || result;
};

export const getBranches = async () => {
  let response = await fetch(`${API_BASE_URL}/api/branches`, {
    headers: { 'Accept': 'application/json' }
  });
  
  if (!response.ok) {
    response = await fetch(`${API_BASE_URL}/api/admin/branches`, {
      headers: { 'Accept': 'application/json' }
    });
  }

  if (!response.ok) throw new Error('Failed to load branches');
  const result = await response.json();
  return result.data || result;
};

export const submitContact = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Gửi liên hệ thất bại');
  return result;
};
