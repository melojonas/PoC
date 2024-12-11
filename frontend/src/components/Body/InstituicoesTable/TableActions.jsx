import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const TableActions = ({ row, handleEdit, handleDelete }) => {
    return (
        <div className="table-actions">
            <Button variant="warning" onClick={() => handleEdit(row.original)}>
                Editar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(row.original._id)}>
                Excluir
            </Button>
        </div>
    );
};

TableActions.propTypes = {
    row: PropTypes.shape({
        original: PropTypes.shape({
            _id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default TableActions;
