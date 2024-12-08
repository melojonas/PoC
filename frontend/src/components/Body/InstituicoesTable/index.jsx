import React, { useEffect, useState, useRef } from 'react';
import { useTable } from 'react-table';
import { Button, Modal } from 'react-bootstrap';
import axios from '../../../api/axios';
import FormInstituicao from '../FormInstituicao';
import './index.css';
import PropTypes from 'prop-types';

const InstituicoesTable = () => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentInstituicao, setCurrentInstituicao] = useState(null);
    const formRef = useRef(null);

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
    }, [fetchData]);

    const handleEdit = React.useCallback((instituicao) => {
        setCurrentInstituicao(instituicao);
        setShowModal(true);
    }, []);

    const handleDelete = React.useCallback(async (id) => {
        try {
            await axios.delete(`/instituicoes/${id}`);
            fetchData();
        } catch (error) {
            console.error('Erro ao deletar instituição:', error);
        }
    }, [fetchData]);

    const handleSubmit = async (data) => {
        try {
            await axios.put(`/instituicoes/${currentInstituicao._id}`, data);
 
            setShowModal(false);
            fetchData();
        } catch {
            alert('Erro ao editar a instituição');
        }
    };

    const handleSave = () => {
        if (formRef.current) { formRef.current.submit(); }
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Nome', accessor: 'nome' },
            { Header: 'UF', accessor: 'uf' },
            { Header: 'Qtd Alunos', accessor: 'qtdAlunos' },
            {
                Header: 'Editar',
                accessor: 'edit',
                Cell: ({ row }) => (
                    <Button variant="warning" onClick={() => handleEdit(row.original)}>
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
        [handleDelete, handleEdit]
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
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} key={column.id}>
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
                    <FormInstituicao ref={formRef} initialData={currentInstituicao} onSubmit={handleSubmit} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

InstituicoesTable.propTypes = {
    row: PropTypes.shape({
        original: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nome: PropTypes.string.isRequired,
            uf: PropTypes.string.isRequired,
            qtdAlunos: PropTypes.number.isRequired,
        }).isRequired,
    }),
};

export default InstituicoesTable;