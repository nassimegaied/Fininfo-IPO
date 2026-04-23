import { useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const CreateOffer = () => {
  const { keycloak } = useKeycloak();
  const [form, setForm] = useState({
    typeOffre: 'PRIX_FERME',
    natureTitre: '',
    montantGlobal: '',
    periodeDebut: '',
    periodeFin: '',
    referenceVisaAMMC: '',
    dateVisa: '',
    nombreActionsACeder: '',
    nombreNouvellesActions: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/offres', form, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      });
      alert('Offer created with ID: ' + res.data.id);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create IPO Offer</h2>
      <label>Type Offre:</label>
      <select name="typeOffre" value={form.typeOffre} onChange={handleChange}>
        <option value="PRIX_FERME">À prix fermé</option>
        <option value="PRIX_VARIABLE">À prix variable</option>
      </select>
      <br />
      <label>Nature Titre:</label>
      <input name="natureTitre" value={form.natureTitre} onChange={handleChange} />
      <br />
      <label>Montant Global:</label>
      <input name="montantGlobal" type="number" value={form.montantGlobal} onChange={handleChange} />
      <br />
      <label>Période début:</label>
      <input name="periodeDebut" type="datetime-local" value={form.periodeDebut} onChange={handleChange} />
      <br />
      <label>Période fin:</label>
      <input name="periodeFin" type="datetime-local" value={form.periodeFin} onChange={handleChange} />
      <br />
      <label>Référence Visa AMMC:</label>
      <input name="referenceVisaAMMC" value={form.referenceVisaAMMC} onChange={handleChange} />
      <br />
      <label>Date Visa:</label>
      <input name="dateVisa" type="date" value={form.dateVisa} onChange={handleChange} />
      <br />
      <label>Nombre actions à céder:</label>
      <input name="nombreActionsACeder" type="number" value={form.nombreActionsACeder} onChange={handleChange} />
      <br />
      <label>Nombre nouvelles actions:</label>
      <input name="nombreNouvellesActions" type="number" value={form.nombreNouvellesActions} onChange={handleChange} />
      <br />
      <button type="submit">Save Offer</button>
    </form>
  );
};

export default CreateOffer;