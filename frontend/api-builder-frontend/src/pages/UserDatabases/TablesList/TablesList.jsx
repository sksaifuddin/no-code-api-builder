import React, { useEffect, useState } from 'react';
import { getAllTablesData } from '../../../services/get-tables-data-service';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function TablesList({ reloadData }) {
  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    // Fetch the data from the API
    const fetchData = async () => {
      try {
        const data = await getAllTablesData(userId);
        setTablesData(data);
      } catch (error) {
        console.error('Error fetching tables data:', error);
      }
    };

    fetchData();
  }, [reloadData]);

  const getDisplayName = (tableName) => {
    const indexOfUnderscore = tableName.indexOf('_');
    if (indexOfUnderscore !== -1) {
      return tableName.substring(0, indexOfUnderscore);
    }
    return tableName;
  };

  return (
    <div style={{ width: '80%' }}>
    {tablesData.map((table, index) => (
      <div key={index} style={{ marginBottom: 20 }}>
        <h2>{getDisplayName(table.tableName)}</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {table.columns.map((column) => (
                  <TableCell key={column.name}>{column.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                {table.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                  {table.columns.map((column, columnIndex) => {
                    const cellData = row.find(
                      (cell) => cell.columnName === column.name
                    );
                    // Check if the column type is 'tinyint(1)' and convert the value to true/false
                    const cellValue =
                      column.type === 'tinyint(1)' && cellData
                        ? cellData.value === 1
                          ? 'true'
                          : 'false'
                        : cellData?.value;
                    return <TableCell key={columnIndex}>{cellValue}</TableCell>;
                  })}
                </TableRow>
                ))}
              </TableBody>
          </Table>
        </TableContainer>
      </div>
    ))}
  </div>
  );
}

export default TablesList;
