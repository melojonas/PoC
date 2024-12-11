import React, { useEffect, useState, useRef } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, Form, Pagination } from 'react-bootstrap';
import axios from '../../../api/axios';
import FormInstituicao from '../FormInstituicao';
import './index.css';
import PropTypes from 'prop-types';
import ReusableModal from '../ReusableModal';

/**
 * Componente InstituicoesTable
 * 
 * @component
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onDataChange - Função chamada quando os dados são alterados
 * @param {boolean} props.dataChanged - Indica se os dados foram alterados
 * @returns {JSX.Element} - Elemento JSX da tabela de instituições
 */
const InstituicoesTable = ({ onDataChange, dataChanged }) => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentInstituicao, setCurrentInstituicao] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef(null); // Referência para submeter o formulário programaticamente

    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [filterByNome, setFilterByNome] = useState('');
    const [filterByUf, setFilterByUf] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = React.useCallback(async () => {
        try {
            const response = await axios.get('/instituicoes', {
                params: {
                    orderBy,
                    order,
                    filterByNome,
                    filterByUf,
                    page,
                    limit: pageSize,
                },
            });
            setData(response.data);
            setTotalPages(Math.ceil(response.data.length / pageSize));
        } catch (error) {
            console.error('Erro ao buscar instituições:', error);
        }
    }, [orderBy, order, filterByNome, filterByUf, page, pageSize]);

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
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize: currentPageSize },
    } = useTable(
        { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
        useSortBy,
        usePagination
    );

    return (
        <div className="table-container">
            <Form>
                <Form.Group controlId="filterByNome">
                    <Form.Label>Filtrar por Nome</Form.Label>
                    <Form.Control
                        type="text"
                        value={filterByNome}
                        onChange={(e) => setFilterByNome(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="filterByUf">
                    <Form.Label>Filtrar por UF</Form.Label>
                    <Form.Control
                        type="text"
                        value={filterByUf}
                        onChange={(e) => setFilterByUf(e.target.value)}
                    />
                </Form.Group>
            </Form>
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
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
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
            <Pagination>
                <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                {pageOptions.map((page, index) => (
                    <Pagination.Item
                        key={index}
                        active={pageIndex === page}
                        onClick={() => gotoPage(page)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
            </Pagination>

            {/* Modal para editar instituição */}
            <ReusableModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="Editar Instituição"
                errorMessage={errorMessage}
                formRef={formRef}
                handleSubmit={handleEdit}
            >
                <FormInstituicao ref={formRef} initialData={currentInstituicao} />
            </ReusableModal>
        </div>
    );
};

// Definição das propTypes do componente
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
