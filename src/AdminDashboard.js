import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
const AdminDashboard = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [editingRow, setEditingRow] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = () => {
        // Fetch data from the API endpoint
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error('Error fetching data:', error));
    };
    const renderTable = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const displayedData = data
            .filter(row =>
                Object.values(row).some(
                    value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
            .slice(startIndex, endIndex);

        return (
            <tbody>
            {displayedData.map(row => (
                <tr key={row.id} className={selectedRows.includes(row.id) ? 'selected' : ''}>
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                        />
                    </td>
                    <td>
                        {editingRow === row.id ? (
                            <input
                                type="text"
                                value={row.name}
                                onChange={(e) => handleEditChange(e, row.id, 'name')}
                            />
                        ) : (
                            row.name
                        )}
                    </td>
                    <td>
                        {editingRow === row.id ? (
                            <input
                                type="text"
                                value={row.email}
                                onChange={(e) => handleEditChange(e, row.id, 'email')}
                            />
                        ) : (
                            row.email
                        )}
                    </td>
                    <td>
                        {row.role}
                    </td>
                    <td>
                        {editingRow === row.id ? (
                            <>
                                <button onClick={() => saveChanges(row.id)} className="save">Save</button>
                                <button onClick={() => cancelEdit(row.id)} className="cancel">Cancel</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => editRow(row.id)} className="edit">Edit</button>
                                <button onClick={() => deleteRow(row.id)} className="delete">Delete</button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        );
    };
    const updatePagination = () => {
        const totalPages = Math.ceil(
            data
                .filter(row =>
                    Object.values(row).some(
                        value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
                .length / pageSize
        );
        const limitedPages = Math.min(totalPages, 3);
        return (
            <div className="pagination">
                <button onClick={() => navigate('first-page')} className="first-page">First Page</button>
                <button onClick={() => navigate('previous-page')} className="previous-page">Previous Page</button>
                {[...Array(limitedPages).keys()].map(pageNum => (
                    <button key={pageNum + 1} onClick={() => goToPage(pageNum + 1)}>{pageNum + 1}</button>
                ))}
                <button onClick={() => navigate('next-page')} className="next-page">Next Page</button>
                <button onClick={() => navigate('last-page')} className="last-page">Last Page</button>
            </div>
        );
    };
    const search = () => {
        setCurrentPage(1);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    };
    const goToPage = (page) => {
        setCurrentPage(page);
    };
    const navigate = (page) => {
        const totalPages = Math.ceil(
            data
                .filter(row =>
                    Object.values(row).some(
                        value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
                .length / pageSize
        );
        switch (page) {
            case 'first-page':
                setCurrentPage(1);
                break;
            case 'previous-page':
                setCurrentPage(Math.max(currentPage - 1, 1));
                break;
            case 'next-page':
                setCurrentPage(Math.min(currentPage + 1, totalPages));
                break;
            case 'last-page':
                setCurrentPage(totalPages);
                break;
            default:
                break;
        }
    };
    const editRow = (id) => {
        setEditingRow(id);
    };
    const deleteRow = (id) => {
        const updatedData = data.filter(row => row.id !== id);
        setData(updatedData);
        setSelectedRows(selectedRows.filter(selectedId => selectedId !== id));
    };
    const saveChanges = (id) => {
        setEditingRow(null);
    };
    const cancelEdit = (id) => {
        setEditingRow(null);
    };
    const handleEditChange = (e, id, field) => {
        const updatedData = data.map(row =>
            row.id === id ? { ...row, [field]: e.target.value } : row
        );
        setData(updatedData);
    };
    const toggleSelect = (id) => {
        const updatedSelectedRows = selectedRows.includes(id)
            ? selectedRows.filter(selectedId => selectedId !== id)
            : [...selectedRows, id];

        setSelectedRows(updatedSelectedRows);
    };
    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={search} className="search-icon">Search</button>
            <table>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {renderTable()}
            </table>
            {updatePagination()}
        </div>
    );
};
export default AdminDashboard;
