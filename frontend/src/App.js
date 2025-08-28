import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Use environment variable for API URL, with a fallback for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  // State for the creation form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsSought, setSkillsSought] = useState('');

  // State for the search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');

  // State for all available skills
  const [allSkills, setAllSkills] = useState([]);

  // Function to fetch all unique skills
  const fetchSkills = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/skills/`, { cache: 'no-cache' });
      if (response.ok) {
        const skills = await response.json();
        setAllSkills(skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  }, []);

  // Fetch skills when the component mounts
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleCreateUser = async (event) => {
    event.preventDefault();

    const userData = {
      name: name,
      email: email,
      skills_offered: skillsOffered.split(',').map(skill => skill.trim()).filter(Boolean),
      skills_sought: skillsSought.split(',').map(skill => skill.trim()).filter(Boolean)
    };

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        alert(`¡Usuario "${newUser.name}" creado con éxito!`);
        // Limpiar el formulario
        setName('');
        setEmail('');
        setSkillsOffered('');
        setSkillsSought('');
        // Refresh the skills list
        fetchSkills();
      } else {
        const errorData = await response.json();
        alert(`Error al crear usuario: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión. ¿Está el servidor backend funcionando?');
    }
  };

  // Refactored search logic to be callable
  const performSearch = useCallback(async (skillToSearch) => {
    if (!skillToSearch) {
      return;
    }
    setSearchMessage('');
    setSearchResults([]);

    try {
      const response = await fetch(`${API_URL}/users/search/?skill=${encodeURIComponent(skillToSearch)}`);
      
      if (response.ok) {
        const users = await response.json();
        setSearchResults(users);
        if (users.length === 0) {
          setSearchMessage(`No se encontraron usuarios que ofrezcan la habilidad: "${skillToSearch}".`);
        }
      } else {
        alert('Error al realizar la búsqueda.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión. ¿Está el servidor backend funcionando?');
    }
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm) {
        alert('Por favor, ingresa una habilidad para buscar.');
        return;
    }
    performSearch(searchTerm);
  };

  const handleSkillClick = (skill) => {
    setSearchTerm(skill);
    performSearch(skill);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plataforma de Intercambio de Habilidades</h1>
        
        <div className="container">
          {/* User Creation Form */}
          <div className="form-container">
            <h2>Crear Perfil de Usuario</h2>
            <form onSubmit={handleCreateUser}>
              <div>
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="skillsOffered">Habilidades que ofreces (separadas por comas):</label>
                <input
                  type="text"
                  id="skillsOffered"
                  list="skills-datalist"
                  value={skillsOffered}
                  onChange={(e) => setSkillsOffered(e.target.value)}
                  required
                  placeholder="Ej: Python, React, Cocina"
                />
                <datalist id="skills-datalist">
                  {allSkills.map(skill => (
                    <option key={skill} value={skill} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="skillsSought">Habilidades que buscas (separadas por comas):</label>
                <input
                  type="text"
                  id="skillsSought"
                  list="skills-datalist"
                  value={skillsSought}
                  onChange={(e) => setSkillsSought(e.target.value)}
                  required
                  placeholder="Ej: Inglés, Marketing"
                />
              </div>
              <button type="submit">Guardar Perfil</button>
            </form>
          </div>

          {/* Search Section */}
          <div className="search-container">
            <h2>Buscar Usuarios por Habilidad</h2>
            
            <div className="skills-list">
              <h3>Habilidades Disponibles</h3>
              <select className="skills-dropdown" onChange={(e) => handleSkillClick(e.target.value)} value={searchTerm || ''}>
                <option value="">-- Elige una habilidad --</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Escribe una habilidad o haz clic en una de arriba"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">Buscar</button>
            </form>

            <div className="results-container">
              {searchMessage && <p>{searchMessage}</p>}
              {searchResults.map(user => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p><strong>Correo:</strong> {user.email}</p>
                  <p><strong>Ofrece:</strong> {user.skills_offered}</p>
                  <p><strong>Busca:</strong> {user.skills_sought}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
