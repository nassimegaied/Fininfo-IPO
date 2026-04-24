import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const CheckEligibility = () => {
  // We'll allow the user to type an offer ID, or we can take it from the URL
  const { offreId: paramOffreId } = useParams(); // if we route via /offres/:offreId/eligibility
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const [offreId, setOffreId] = useState(paramOffreId || '');
  const [profile, setProfile] = useState({
    typePersonne: '',
    residence: '',
    nationalite: '',
    regimeRemuneration: '',
    conditionEligibilite: '',
    anciennete: '',
    mineur: false,
    titulaire: false,
    inscritListeSyndicat: false,
  });

  const [tranches, setTranches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If we ever need to fetch the offer name to display, we could, but for now just use the ID.

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offreId) {
      setError('Please enter an Offer ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Remove empty fields so they act as wildcards
      const filteredProfile = Object.fromEntries(
        Object.entries(profile).filter(([_, v]) => v !== '' && v !== false)
      );
      const response = await axios.post(
        `http://localhost:8081/api/offres/${offreId}/tranches/compatibles`,
        filteredProfile,
        { headers: { Authorization: `Bearer ${keycloak.token}` } }
      );
      setTranches(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setTranches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Check Tranche Eligibility</h2>
      {!paramOffreId && (
        <div>
          <label>Offer ID: </label>
          <input
            type="number"
            value={offreId}
            onChange={(e) => setOffreId(e.target.value)}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Investor Profile</legend>
          <label>Type:</label>
          <select name="typePersonne" value={profile.typePersonne} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>Physique</option>
            <option>Moral</option>
          </select><br/>
          <label>Residence:</label>
          <select name="residence" value={profile.residence} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>Résident</option>
            <option>Non résident</option>
          </select><br/>
          <label>Nationalité:</label>
          <select name="nationalite" value={profile.nationalite} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>Marocaine</option>
            <option>étrangère</option>
          </select><br/>
          <label>Régime de rémunération:</label>
          <select name="regimeRemuneration" value={profile.regimeRemuneration} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Autres</option>
          </select><br/>
          <label>Condition d'éligibilité:</label>
          <select name="conditionEligibilite" value={profile.conditionEligibilite} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>Titulaire</option>
            <option>Non démissionnaire</option>
          </select><br/>
          <label>Ancienneté:</label>
          <select name="anciennete" value={profile.anciennete} onChange={handleProfileChange}>
            <option value="">Any</option>
            <option>Salarié</option>
            <option>Dirigeant/salarié</option>
            <option>Dirigeant</option>
          </select><br/>
          <label>Mineur:</label>
          <input name="mineur" type="checkbox" checked={profile.mineur} onChange={handleProfileChange} /><br/>
          <label>Titulaire syndicat:</label>
          <input name="titulaire" type="checkbox" checked={profile.titulaire} onChange={handleProfileChange} /><br/>
          <label>Inscrit liste syndicat:</label>
          <input name="inscritListeSyndicat" type="checkbox" checked={profile.inscritListeSyndicat} onChange={handleProfileChange} />
        </fieldset>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find Compatible Tranches'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tranches.length > 0 && (
        <div>
          <h3>Compatible Tranches</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Prix de souscription</th>
                <th>Min</th>
                <th>Plafond</th>
                <th>Montant Offre</th>
                <th>% Global</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tranches.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nom || '-'}</td>
                  <td>{t.typePersonne ? `${t.typePersonne} (Corporate)` : 'Syndicat'}</td>
                  <td>{t.prixSouscription}</td>
                  <td>{t.minSouscription}</td>
                  <td>{t.plafondSouscription}</td>
                  <td>{t.montantOffre}</td>
                  <td>{t.pourcentageMontantGlobal}%</td>
                  <td>{t.nombreActions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tranches.length === 0 && !loading && !error && (
        <p>No compatible tranches found for this profile.</p>
      )}
    </div>
  );
};

export default CheckEligibility;