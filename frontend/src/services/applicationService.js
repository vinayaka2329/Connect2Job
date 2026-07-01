const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const createApplication = async (data) => {
  const response = await fetch(`${API}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to submit application'
    );
  }

  return result;
};

export const getApplications = async () => {
  const response = await fetch(
    `${API}/applications`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to fetch applications'
    );
  }

  return result;
};