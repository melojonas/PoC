import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { Button } from 'react-bootstrap';
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

    // Estados para ordenação, paginação e filtragem
    // eslint-disable-next-line no-unused-vars
    const [pageIndex, setPageIndex] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [pageSize, setPageSize] = useState(15);
    const [globalFilter, setGlobalFilter] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/instituicoes'); // TODO: Adicionar paginação, ordenação e filtros
            setData(response.data);
        } catch (error) {
            console.error('Erro ao buscar instituições:', error);
        }
    }, [pageIndex, pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData, dataChanged]);

    // Deleta a instituição pelo id e useCallback pelo uso da função no useMemo
    const handleDelete = useCallback(async (id) => {
        try {
            await axios.delete(`/instituicoes/${id}`);
            fetchData();
            onDataChange();
        } catch (error) {
            console.error('Erro ao deletar instituição:', error);
        }
    }, [fetchData, onDataChange]);

    /**
     * Recebe os dados do formulário e faz a requisição PUT para atualizar a instituição
     * 
     * @param {Object} data - Dados da instituição
     * @param {string} data.nome - Nome da instituição
     * @param {string} data.uf - Unidade Federativa da instituição
     * @param {number} data.qtdAlunos - Quantidade de alunos da instituição
     */
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
    const columns = useMemo(
        () => [
            { Header: 'Nome', accessor: 'nome', sortType: 'basic' },
            { Header: 'UF', accessor: 'uf', sortType: 'basic' },
            {
                Header: 'Qtd Alunos',
                accessor: 'qtdAlunos',
                Cell: ({ value }) => value.toLocaleString('pt-BR'), // Formata o número para o padrão brasileiro
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

    // Cria a tabela com os dados e as funções de paginação e ordenação
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
        state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter: tableGlobalFilter },
        setGlobalFilter: setTableGlobalFilter,
        } = useTable(
            { 
                columns, 
                data, 
                initialState: { 
                    pageIndex, 
                    pageSize,
                    sortBy: [{ id: 'qtdAlunos', desc: true }],
                    globalFilter
                }
            },
            useGlobalFilter,
            useSortBy,
            usePagination
        );

    return (
        <div className="table-container">
            {/* Campo de filtro global */}
            <input
                className="global-filter-input"
                value={tableGlobalFilter || ''}
                onChange={e => {
                    setGlobalFilter(e.target.value);
                    setTableGlobalFilter(e.target.value);
                }}
                placeholder="Filtrar por instituições ou estado"
            />
            {/* Tabela de instituições */}
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
            {data.length === 0 && <div className="empty-table">Nenhuma instituição cadastrada.</div>}
            {/* Paginação */}
            {data.length > 0 && (
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
            )}

            {/* Modal para editar instituição */}
            <ReusableModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="Editar Instituição"
                errorMessage={errorMessage}
                formRef={formRef}
                handleSubmit={handleEdit}
            >
                <FormInstituicao ref={formRef} initialData={currentInstituicao} onSubmit={handleEdit}/>
            </ReusableModal>
        </div>
    );
};

// Validação das propriedades
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
