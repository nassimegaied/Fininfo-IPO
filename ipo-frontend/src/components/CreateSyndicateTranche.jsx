import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const CreateSyndicateTranche = () => {
  const { offreId } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    montantOffre: '',
    nombreActions: '',
    prixSouscription: '',
    pourcentageMontantGlobal: '',
    plafondSouscription: '',
    minSouscription: '',
    impotBourse: '',
    fraisIntermediation: '',
    fraisTransaction: '',
    creditObligatoire: false,
    comptantObligatoire: false,
    collateralObligatoire: false,
    modaliteAllocation: 'Prorata des demandes',
    tauxCouverture: '',
    moyensCouverture: '',
    statutInvestisseur: 'Qualifié',
    droitApplicable: 'Marocain',

    // Syndicat-specific fields
    typePersonne: 'Physique',
    residence: 'Résident',
    nationalite: 'Marocaine',
    titulaire: false,
    mineur: false,
    inscritListeSyndicat: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8081/api/offres/${offreId}/tranches/syndicat`,
        form,
        { headers: { Authorization: `Bearer ${keycloak.token}` } }
      );
      alert('Syndicate tranche created!');
      navigate('/offres');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container">
      <h2>Create Syndicate Tranche for Offer {offreId}</h2>
      <form onSubmit={handleSubmit}>
        {/* Common fields (same as corporate) */}
        <fieldset>
          <legend>Paramètres de la tranche</legend>
          <label>Nom:</label>
          <input name="nom" value={form.nom} onChange={handleChange} />
          <label>Montant Offre:</label>
          <input name="montantOffre" type="number" value={form.montantOffre} onChange={handleChange} />
          <label>Nombre Actions:</label>
          <input name="nombreActions" type="number" value={form.nombreActions} onChange={handleChange} />
          <label>Prix Souscription:</label>
          <input name="prixSouscription" type="number" value={form.prixSouscription} onChange={handleChange} />
          <label>% Montant Global:</label>
          <input name="pourcentageMontantGlobal" type="number" step="0.01" value={form.pourcentageMontantGlobal} onChange={handleChange} />
          <label>Plafond Sousc.:</label>
          <input name="plafondSouscription" type="number" value={form.plafondSouscription} onChange={handleChange} />
          <label>Min Souscription:</label>
          <input name="minSouscription" type="number" value={form.minSouscription} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Frais</legend>
          <label>Impôt Bourse:</label>
          <input name="impotBourse" type="number" step="0.0001" value={form.impotBourse} onChange={handleChange} />
          <label>Frais Intermédiation:</label>
          <input name="fraisIntermediation" type="number" step="0.0001" value={form.fraisIntermediation} onChange={handleChange} />
          <label>Frais Transaction:</label>
          <input name="fraisTransaction" type="number" step="0.0001" value={form.fraisTransaction} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Méthode de paiement</legend>
          <label>Crédit Obligatoire:</label>
          <input name="creditObligatoire" type="checkbox" checked={form.creditObligatoire} onChange={handleChange} />
          <label>Comptant Obligatoire:</label>
          <input name="comptantObligatoire" type="checkbox" checked={form.comptantObligatoire} onChange={handleChange} />
          <label>Collatéral Obligatoire:</label>
          <input name="collateralObligatoire" type="checkbox" checked={form.collateralObligatoire} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Allocation & Couverture</legend>
          <label>Modalité:</label>
          <select name="modaliteAllocation" value={form.modaliteAllocation} onChange={handleChange}>
            <option>Prorata des demandes</option>
            <option>Par itération</option>
          </select>
          <label>Taux Couverture:</label>
          <input name="tauxCouverture" type="number" step="0.01" value={form.tauxCouverture} onChange={handleChange} />
          <label>Moyens Couverture:</label>
          <input name="moyensCouverture" value={form.moyensCouverture} onChange={handleChange} />
        </fieldset>

        <fieldset>
          <legend>Placement</legend>
          <label>Statut Investisseur:</label>
          <select name="statutInvestisseur" value={form.statutInvestisseur} onChange={handleChange}>
            <option>Qualifié</option>
            <option>Non Qualifié</option>
          </select>
          <label>Droit Applicable:</label>
          <select name="droitApplicable" value={form.droitApplicable} onChange={handleChange}>
            <option>Marocain</option>
            <option>étranger</option>
          </select>
        </fieldset>

        {/* Syndicat-specific fields (simplified) */}
        <fieldset>
          <legend>Personnel Syndicat – Éligibilité</legend>
          <label>Type:</label>
          <select name="typePersonne" value={form.typePersonne} onChange={handleChange}>
            <option>Physique</option>
            <option>Moral</option>
          </select>
          <label>Résidence:</label>
          <select name="residence" value={form.residence} onChange={handleChange}>
            <option>Résident</option>
            <option>Non résident</option>
          </select>
          <label>Nationalité:</label>
          <select name="nationalite" value={form.nationalite} onChange={handleChange}>
            <option>Marocaine</option>
            <option>étrangère</option>
          </select>
          <label>Titulaire:</label>
          <input name="titulaire" type="checkbox" checked={form.titulaire} onChange={handleChange} />
          <label>Mineur:</label>
          <input name="mineur" type="checkbox" checked={form.mineur} onChange={handleChange} />
          <label>Inscrit liste syndicat:</label>
          <input name="inscritListeSyndicat" type="checkbox" checked={form.inscritListeSyndicat} onChange={handleChange} />
        </fieldset>

        <button type="submit">Save Syndicate Tranche</button>
      </form>
    </div>
  );
};

export default CreateSyndicateTranche;