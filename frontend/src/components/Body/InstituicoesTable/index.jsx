import React, { useEffect, useState, useRef } from 'react';
import { useTable } from 'react-table';
import { Button, Modal } from 'react-bootstrap';
import axios from '../../../api/axios';
import FormInstituicao from '../FormInstituicao';
import './index.css';
import PropTypes from 'prop-types';

const InstituicoesTable = ({ onDataChange, dataChanged }) => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentInstituicao, setCurrentInstituicao] = useState(null);
    const formRef = useRef(null); // Referência para submeter o formulário programaticamente
    const [errorMessage, setErrorMessage] = useState('');

    const fetchData = React.useCallback(async () => {
        try {
            const response = await axios.get('/instituicoes');
            setData(response.data);
        } catch (error) {
            console.error('Erro ao buscar instituições:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, dataChanged]);

    // Deleta a instituição pelo id e useCallback pelo uso da função no useMemo
    const handleDelete = React.useCallback(async (id) => {
        try {
            await axios.delete(`/instituicoes/${id}`);
            fetchData();
            onDataChange();
        } catch (error) {
            console.error('Erro ao deletar instituição:', error);
        }
    }, [fetchData, onDataChange]);

    // Recebe os dados do formulário e faz a requisição PUT para atualizar a instituição
    const handleEdit = async (data) => {
        try {
            await axios.put(`/instituicoes/${currentInstituicao._id}`, data);
 
            setShowModal(false);
            fetchData();
            onDataChange();
        } catch {
            setErrorMessage('Erro ao editar a instituição.');
        }
    };

    // Define as colunas da tabela e useMemo pois não é necessário recriar as colunas a cada renderização
    const columns = React.useMemo(
        () => [
            { Header: 'Nome', accessor: 'nome' },
            { Header: 'UF', accessor: 'uf' },
            { Header: 'Qtd Alunos', accessor: 'qtdAlunos' },
            {
                Header: 'Editar',
                accessor: 'edit',
                Cell: ({ row }) => (
                    <Button variant="warning" onClick={() => {
                        setCurrentInstituicao(row.original);
                        setShowModal(true);
                    }}>
                        Editar
                    </Button>
                ),
            },
            {
                Header: 'Excluir',
                accessor: 'delete',
                Cell: ({ row }) => (
                    <Button variant="danger" onClick={() => handleDelete(row.original._id)}>
                        Excluir
                    </Button>
                ),
            },
        ],
        [handleDelete]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <div className="table-container">
            <table {...getTableProps()} style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                <thead>
                    {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${index}`}>
                            {headerGroup.headers.map((column, colIndex) => (
                                <th {...column.getHeaderProps()} key={`column-${colIndex}`}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} key={cell.column.id}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Instituição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormInstituicao ref={formRef} initialData={currentInstituicao} onSubmit={handleEdit} />
                </Modal.Body>
                <Modal.Footer>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={() => formRef.current && formRef.current.submit()}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

InstituicoesTable.propTypes = {
    row: PropTypes.shape({
        cells: PropTypes.arrayOf(
            PropTypes.shape({
                getCellProps: PropTypes.func.isRequired,
                render: PropTypes.func.isRequired,
                column: PropTypes.shape({
                    id: PropTypes.string.isRequired,
                }).isRequired,
            }).isRequired
        ).isRequired,
        id: PropTypes.string.isRequired,
        original: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nome: PropTypes.string.isRequired,
            uf: PropTypes.string.isRequired,
            qtdAlunos: PropTypes.number.isRequired,
        }).isRequired,
        getRowProps: PropTypes.func.isRequired,
    }),
    onDataChange: PropTypes.func.isRequired,
    dataChanged: PropTypes.bool.isRequired,
};

export default InstituicoesTable;