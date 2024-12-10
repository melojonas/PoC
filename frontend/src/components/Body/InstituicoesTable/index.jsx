import React, { useEffect, useState, useRef } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Button, Modal } from 'react-bootstrap';
import axios from '../../../api/axios';
import FormInstituicao from '../FormInstituicao';
import './index.css';
import PropTypes from 'prop-types';

const InstituicoesTable = ({ onDataChange, dataChanged }) => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentInstituicao, setCurrentInstituicao] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [pageIndex, setPageIndex] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [pageSize, setPageSize] = useState(15);
    const formRef = useRef(null); // Referência para submeter o formulário programaticamente
    
    const fetchData = React.useCallback(async () => {
        try {
            const response = await axios.get('/instituicoes', {
                params: {
                    page: pageIndex,
                    limit: pageSize,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error('Erro ao buscar instituições:', error);
        }
    }, [pageIndex, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData, dataChanged]);

    // Deleta a instituição pelo id e useCallback pelo uso da função no useMemo
    const handleDelete = React.useCallback(async (id) => {
        if (window.confirm('Deseja realmente excluir esta instituição?'))
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
            { Header: 'Nome', accessor: 'nome', sortType: 'basic' },
            { Header: 'UF', accessor: 'uf', sortType: 'basic' },
            {
                Header: 'Qtd Alunos',
                accessor: 'qtdAlunos',
                Cell: ({ value }) => value.toLocaleString('pt-BR'),
                sortType: 'basic',
            },
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
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize: setTablePageSize,
        state: { pageIndex: tablePageIndex, pageSize: tablePageSize },
    } = useTable(
        { 
            columns, 
            data, 
            initialState: { 
                pageIndex, 
                pageSize,
                sortBy: [{ id: 'qtdAlunos', desc: true }]
            }
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="table-container">
            <table {...getTableProps()} style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                <thead>
                    {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${index}`}>
                            {headerGroup.headers.map((column, colIndex) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`column-${colIndex}`}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' ▼'
                                                : ' ▲'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
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
            <div className="pagination">
                <div className="pagination-info">
                    <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} variant="outline-primary">
                        {'<<'}
                    </Button>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage} variant="outline-primary">
                        {'<'}
                    </Button>
                    <span className="pagination-info">
                        Página{' '}
                        <strong>
                            {tablePageIndex + 1} de {pageOptions.length}
                        </strong>
                    </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage} variant="outline-primary">
                        {'>'}
                    </Button>
                    <Button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} variant="outline-primary">
                        {'>>'}
                    </Button>
                </div>
                <div className="pagination-selection">
                    <span className="pagination-go-to">
                        Ir para página:{' '}
                        <input
                            type="number"
                            defaultValue={tablePageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                        />
                    </span>
                    <select
                        value={tablePageSize}
                        onChange={e => {
                            setTablePageSize(Number(e.target.value));
                        }}
                    >
                        {[15, 30, data.length].map(tablePageSize => (
                            <option key={tablePageSize} value={tablePageSize}>
                                {tablePageSize === data.length ? 'Todos' : tablePageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

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