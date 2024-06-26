import React, { useState } from 'react';
import './TelaHome.css'; // Importe seu arquivo de estilos
import TelaPrincipal from './TelaPrincipal';
import fotofemass from './fotofemass.png';
import './TelaHome.css'; // Importe o arquivo de estilos atualizado

function Home() {
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2 className='menu'>Menu</h2>
        <ul>
          <li className={currentScreen === 'home' ? 'active' : ''} onClick={() => handleNavigate('home')}>
          <p className='tabs'>Home</p>
          </li>
          <li className={currentScreen === 'pesquisador' ? 'active' : ''} onClick={() => handleNavigate('pesquisador')}>
            <p className='tabs'>Pesquisadores</p>
          </li>
        </ul>
      </div>
      <div className="content">
        {currentScreen === 'pesquisador' && <TelaPrincipal />}
        {currentScreen === 'home' && (
          <div>
            <h1 className="home-title">Controle de Trabalho de Pesquisadores</h1>
            <img
              src={fotofemass}
              alt="Imagem de exemplo"
              className="logohome"
              style={{ width: '600px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
