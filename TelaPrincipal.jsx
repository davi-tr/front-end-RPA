import React, { useState, useEffect } from 'react';
import AddResearcherForm from './components/Instituto/AddResearcherForm';
import axios from 'axios';
import Modal from 'react-modal';
import './TelaPrincipal.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function TelaPrincipal() {
  const [pesquisadores, setPesquisadores] = useState([]);
  const [selectedPesquisador, setSelectedPesquisador] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const [pesquisadorXmlId, setPesquisadorXmlId] = useState(null);
  const [pesquisadorAdicionadoId, setPesquisadorAdicionadoId] = useState(null);

  
   const [currentPage, setCurrentPage] = useState(0);

   // Estado para armazenar o número total de elementos na tabela
   const [totalElements, setTotalElements] = useState(false);
 
   // Estado para controlar a quantidade de itens por página
   const [itensPerPage, setItensPerPage] = useState(10);// Inicialize com 0

   const startIndex = currentPage * itensPerPage;
   const endIndex = startIndex + itensPerPage;
   const currentItens = pesquisadores.slice(startIndex, endIndex);

   const [searchText, setSearchText] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const [filter, setFilter] = useState('all');

   const pages = Math.ceil(totalElements / itensPerPage);

  useEffect(() => {
    fetchPesquisadores();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchPesquisadores();
  }, [itensPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchPesquisadores = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/RPA`);
      setPesquisadores(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de robôs:', error);
    }
  };

  const handleDeleteClick = async (pesquisadorId) => {
    try {
      await axios.delete(`http://localhost:8083/RPA/${pesquisadorId}`);
      console.log(`http://localhost:8083/RPA/${pesquisadorId}`)
      // Atualizar a lista de pesquisadores após a exclusão
      fetchPesquisadores();
      setSelectedPesquisador(null); // Limpar a seleção
    } catch (error) {
      console.error('Erro ao excluir o pesquisador:', error);
    }
  };

  const handlePesquisadorSelect = (pesquisador) => {
    setSelectedPesquisador(pesquisador);
    setSelectedRowId(pesquisador.idXML);
  };

  const handleRowClick = (pesquisador) => {
    setSelectedPesquisador(pesquisador);
    setPesquisadorAdicionadoId(pesquisador.id);
    console.log(pesquisadores) 
  };

  const searchPesquisadores = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/RPA`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };
  const searchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/RPA`
      );
      setData(response.data.content);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error);
    }
  };
  

  return (
    <div>
      <AddResearcherForm
      />
      <button
        className="delete-button"
        disabled={!selectedPesquisador}
        onClick={() => setShowConfirmationPopup(true)}
      >
        Excluir
      </button>

      <div className="search-input">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="nome">Nome</option>
          <option value="idXML">ID</option>
        </select>
        <input
          type="text"
          placeholder="Pesquisar por nome ou acrônimo"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="container">
        <h2 className="titulo">Pesquisadores Cadastrados</h2>
        <table className="data-table-pesquisadores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Área</th>
              <th>Máquina</th>
              <th>Status</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((pesquisador) => (
                <tr
                  key={pesquisador.id}
                  onClick={() => handleRowClick(pesquisador)}
                  className={`${selectedPesquisador === pesquisador ? 'selected-row' : ''} ${pesquisador.status ? 'green-cell' : 'red-cell'}`}
                >
                  <td>{pesquisador.id}</td>
                  <td>{pesquisador.nome}</td>
                  <td>{pesquisador.maquina}</td>
                  <td>{pesquisador.area}</td>
                  <td>{pesquisador.status ? 'True' : 'False'}</td>
                  <td>{new Date(pesquisador.hora).toLocaleString('pt-BR')}</td>
                </tr>
              ))
            ) : (
              pesquisadores.map((pesquisador) => (
                <tr
                  key={pesquisador.id}
                  onClick={() => handleRowClick(pesquisador)}
                  className={`${selectedPesquisador === pesquisador ? 'selected-row' : ''} ${pesquisador.status ? 'green-cell' : 'red-cell'}`}
                >
                  <td>{pesquisador.id}</td>
                  <td>{pesquisador.nome}</td>
                  <td>{pesquisador.area}</td>
                  <td>{pesquisador.maquina}</td>
                  <td>{pesquisador.status ? 'True' : 'False'}</td>
                  <td>{new Date(pesquisador.hora).toLocaleString('pt-BR')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showConfirmationPopup}
        onRequestClose={() => setShowConfirmationPopup(false)}
        contentLabel="Confirmar Exclusão"
        className="modal-popup"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="modal-header">Confirmar Exclusão</h2>
          {selectedPesquisador && pesquisadorAdicionadoId !== null && (
            <p>
              Deseja realmente excluir o pesquisador com ID:  <span className="highlighted-id">{pesquisadorAdicionadoId}</span>?
            </p>
          )}
          <div className="add-modal-button-container">
            <button
              className="delete-button"
              onClick={() => {
                if (selectedPesquisador && pesquisadorAdicionadoId !== null) {
                  handleDeleteClick(selectedPesquisador.id);
                  setShowConfirmationPopup(false);
                  toast.success('Robo excluido com sucesso!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }}
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="add-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
     


      <div className='pagination'>
        {Array.from(Array(pages), (item, index) => {
          return <button className="botao" value={index} onClick={(e) => setCurrentPage(Number(e.target.value))} key={index}>{index + 1}</button>
        })}
      </div>
      <div className='seletor'>
        <p className='informe'>Quantidade de itens por página</p>
        <select className='qtdItens' value={itensPerPage} onChange={(e) => setItensPerPage(Number(e.target.value))}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
      </div>

    </div>
  );
}

export default TelaPrincipal;