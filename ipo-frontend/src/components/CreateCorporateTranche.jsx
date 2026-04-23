import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const CreateCorporateTranche = () => {
  const { offreId } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // Common tranche fields
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

    // Specific fields for Personnel Corporate
    typePersonne: 'Physique',
    residence: 'Résident',
    nationalite: 'Marocaine',
    regimeRemuneration: 'CDI',
    conditionEligibilite: 'Titulaire',
    anciennete: 'Salarié',
    mineur: false,
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
        `http://localhost:8081/api/offres/${offreId}/tranches/corporate`,
        form,
        { headers: { Authorization: `Bearer ${keycloak.token}` } }
      );
      alert('Corporate tranche created successfully!');
      navigate(`/offres`); // go back to the offer list
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Corporate Tranche for Offer {offreId}</h2>

      {/* Common tranche fields */}
      <fieldset>
        <legend>Paramètres de la tranche</legend>
        <label>Montant de l'offre:</label>
        <input name="montantOffre" type="number" value={form.montantOffre} onChange={handleChange} /><br />
        <label>Nombre d'actions:</label>
        <input name="nombreActions" type="number" value={form.nombreActions} onChange={handleChange} /><br />
        <label>Prix de souscription:</label>
        <input name="prixSouscription" type="number" value={form.prixSouscription} onChange={handleChange} /><br />
        <label>% Montant global:</label>
        <input name="pourcentageMontantGlobal" type="number" step="0.01" value={form.pourcentageMontantGlobal} onChange={handleChange} /><br />
        <label>Plafond par investisseur:</label>
        <input name="plafondSouscription" type="number" value={form.plafondSouscription} onChange={handleChange} /><br />
        <label>Min souscription:</label>
        <input name="minSouscription" type="number" value={form.minSouscription} onChange={handleChange} /><br />
      </fieldset>

      <fieldset>
        <legend>Frais</legend>
        <label>Impôt de bourse:</label>
        <input name="impotBourse" type="number" step="0.0001" value={form.impotBourse} onChange={handleChange} /><br />
        <label>Frais intermédiation:</label>
        <input name="fraisIntermediation" type="number" step="0.0001" value={form.fraisIntermediation} onChange={handleChange} /><br />
        <label>Frais de transaction:</label>
        <input name="fraisTransaction" type="number" step="0.0001" value={form.fraisTransaction} onChange={handleChange} /><br />
      </fieldset>

      <fieldset>
        <legend>Méthode de paiement</legend>
        <label>Crédit obligatoire:</label>
        <input name="creditObligatoire" type="checkbox" checked={form.creditObligatoire} onChange={handleChange} /><br />
        <label>Comptant obligatoire:</label>
        <input name="comptantObligatoire" type="checkbox" checked={form.comptantObligatoire} onChange={handleChange} /><br />
        <label>Collateral obligatoire:</label>
        <input name="collateralObligatoire" type="checkbox" checked={form.collateralObligatoire} onChange={handleChange} /><br />
      </fieldset>

      <fieldset>
        <legend>Allocation & Couverture</legend>
        <label>Modalité d'allocation:</label>
        <select name="modaliteAllocation" value={form.modaliteAllocation} onChange={handleChange}>
          <option>Prorata des demandes</option>
          <option>Par itération</option>
        </select><br />
        <label>Taux de couverture:</label>
        <input name="tauxCouverture" type="number" step="0.01" value={form.tauxCouverture} onChange={handleChange} /><br />
        <label>Moyens de couverture:</label>
        <input name="moyensCouverture" value={form.moyensCouverture} onChange={handleChange} /><br />
      </fieldset>

      <fieldset>
        <legend>Placement</legend>
        <label>Statut investisseur:</label>
        <select name="statutInvestisseur" value={form.statutInvestisseur} onChange={handleChange}>
          <option>Qualifié</option>
          <option>Non Qualifié</option>
        </select><br />
        <label>Droit applicable:</label>
        <select name="droitApplicable" value={form.droitApplicable} onChange={handleChange}>
          <option>Marocain</option>
          <option>étranger</option>
        </select><br />
      </fieldset>

      <fieldset>
        <legend>Personnel corporate – Éligibilité</legend>
        <label>Type:</label>
        <select name="typePersonne" value={form.typePersonne} onChange={handleChange}>
          <option>Physique</option>
          <option>Moral</option>
        </select><br />
        <label>Résidence:</label>
        <select name="residence" value={form.residence} onChange={handleChange}>
          <option>Résident</option>
          <option>Non résident</option>
        </select><br />
        <label>Nationalité:</label>
        <select name="nationalite" value={form.nationalite} onChange={handleChange}>
          <option>Marocaine</option>
          <option>étrangère</option>
        </select><br />
        <label>Régime de rémunération:</label>
        <select name="regimeRemuneration" value={form.regimeRemuneration} onChange={handleChange}>
          <option>CDI</option>
          <option>CDD</option>
          <option>Autres</option>
        </select><br />
        <label>Condition d'éligibilité:</label>
        <select name="conditionEligibilite" value={form.conditionEligibilite} onChange={handleChange}>
          <option>Titulaire</option>
          <option>Non démissionnaire</option>
        </select><br />
        <label>Ancienneté:</label>
        <select name="anciennete" value={form.anciennete} onChange={handleChange}>
          <option>Salarié</option>
          <option>Dirigeant/salarié</option>
          <option>Dirigeant</option>
        </select><br />
        <label>Mineur:</label>
        <input name="mineur" type="checkbox" checked={form.mineur} onChange={handleChange} /><br />
      </fieldset>

      <button type="submit">Save Corporate Tranche</button>
    </form>
  );
};

export default CreateCorporateTranche;