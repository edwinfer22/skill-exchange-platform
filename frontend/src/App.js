import React, { useState } from 'react';
        import './App.css';
   
        function App() {
          const [name, setName] = useState('');
          const [email, setEmail] = useState('');
          const [skillsOffered, setSkillsOffered] = useState('');
          const [skillsSought, setSkillsSought] = useState('');
   
          const handleSubmit = (event) => {
            event.preventDefault();
            // Aquí es donde enviaremos los datos al backend
            console.log('Datos del perfil:', { name, email, skillsOffered, skillsSought });
            alert('Perfil guardado (por ahora solo en consola)!');
            // Limpiar el formulario
            setName('');
            setEmail('');
            setSkillsOffered('');
            setSkillsSought('');
          };
   
          return (
            <div className="App">
              <header className="App-header">
                <h1>Crear Perfil de Usuario</h1>
                <form onSubmit={handleSubmit}>
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
                    <textarea
                      id="skillsOffered"
                      value={skillsOffered}
                      onChange={(e) => setSkillsOffered(e.target.value)}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="skillsSought">Habilidades que buscas (separadas por comas):</label>
                    <textarea
                      id="skillsSought"
                      value={skillsSought}
                      onChange={(e) => setSkillsSought(e.target.value)}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <button type="submit">Guardar Perfil</button>
                </form>
              </header>
            </div>
          );
        }

   export default App;