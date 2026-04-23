import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CreateOffer from './components/CreateOffer';
import CreateCorporateTranche from './components/CreateCorporateTranche';

// Simple component to show logged in status
const Home = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (keycloak.authenticated) {
    return (
      <div>
        <h1>Welcome {keycloak.tokenParsed?.preferred_username}</h1>
        <button onClick={() => keycloak.logout()}>Logout</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={() => keycloak.login()}>Login</button>
      </div>
    );
  }
};

// Component that will later display the list of IPO offers
const OfferList = () => {
  const { keycloak } = useKeycloak();
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    if (keycloak.authenticated) {
      axios.get('http://localhost:8081/api/offres', {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      })
      .then(res => setOffres(res.data))
      .catch(err => console.error(err));
    }
  }, [keycloak]);

  return (
  <div>
    <h2>IPO Offers</h2>
    {offres.length === 0 ? <p>No offers yet.</p> : (
      <ul>
        {offres.map(o => (
          <li key={o.id}>
            {o.natureTitre} - {o.typeOffre} - {o.montantGlobal}
            <Link to={`/offres/${o.id}/add-tranche-corporate`}>
              <button>Add Corporate Tranche</button>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="/offres">Offers</Link>
          <Link to="/create-offer">Create Offer</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offres" element={<OfferList />} />
          <Route path="/create-offer" element={<CreateOffer />} />
          <Route path="/offres/:offreId/add-tranche-corporate" element={<CreateCorporateTranche />} />
        </Routes>
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}

export default App;