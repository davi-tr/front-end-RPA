import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css';

const AddResearcherForm = ({ onClose, updateTable }) => {
  const [researcherId, setResearcherId] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [pesquisadores, setPesquisadores] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [responseControl, setResponseControl] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);



  useEffect(() => {
    const filtered = institutes.filter((institute) =>
      institute.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredInstitutes(filtered);
  }, [searchText, institutes]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/RPA', {
        nome: researcherId,
        maquina: instituteId,
        area: areaId
      });
      console.log("Passou aqui")
      

      // Exibe o alerta de sucesso apenas se o cadastro for bem-sucedido
      toast.success('Robo cadastrado com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setModalIsOpen(false)
      
      fetchPesquisadores();
      updateTable();
      

    } catch (error) {
      console.error('Erro ao cadastrar robô:', error.response.data.mensagem);

      // Exibe o alerta de erro apenas se ocorrer um erro no cadastro
      toast.error(`Erro ao cadastrar robô. Por favor, tente novamente. ERRO:${error.response.data.mensagem}`,{
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get('http://localhost:8083/RPA');
      setPesquisadores(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de robôs:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setModalIsOpen(true)} className="add-button">
        Cadastrar Robô
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Cadastrar Pesquisador"
        className="modal-popup"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="modal-header"> Cadastrar Robô </h2>
          <form onSubmit={handleSubmit}>
            <label className="add-modal-label">
              <input
                type="text"
                value={researcherId}
                onChange={(e) => setResearcherId(e.target.value)}
                className="add-modal-input"
                placeholder="Nome Robô"
              />
            </label>

            <label className="add-modal-label">
              <input
                type="text"
                value={instituteId}
                onChange={(e) => setInstituteId(e.target.value)}
                className="add-modal-input"
                placeholder="Maquina"
              />
            </label>

            <label className="add-modal-label">
              <input
                type="text"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="add-modal-input"
                placeholder="Area"
              />
            </label>

            <div className="add-modal-button-container">
              <button onClick={() => setModalIsOpen(false)} className="mr-2 delete-button">
                Fechar
              </button>
              <button type="submit" className="add-button">
                Cadastrar
              </button>
              
            </div>
          </form>
        </div>
        <h2 className="modal-header"></h2>
        <form onSubmit={handleSubmit}  >
          
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AddResearcherForm;
