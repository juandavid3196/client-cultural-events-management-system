import React, { useState, useEffect } from 'react';

const InterceptionTable = ({ rows, columns, initialCheckedCells, keyId, title, onCheckboxChange, onCellClick }) => {
  const [checkedCells, setCheckedCells] = useState({});

  // Establecer el estado inicial de las casillas cuando initialCheckedCells cambie
  useEffect(() => {
    if (initialCheckedCells) {
      setCheckedCells(initialCheckedCells);
    }
  }, [initialCheckedCells]);

  // Función para generar claves únicas para cada celda
  const generateCellKey = (row, column) => `${row}-${column}`;

  return (
    <table className='custom-table bg-white' style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th className='text-black'>{title}</th>
          {columns.map((column) => (
            <th className='capitalize text-gray-400' key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row}>
            <td className='capitalize text-gray-400'>{row}</td>
            {columns.map((column, columnIndex) => (
              <td key={keyId[columnIndex]}>
                <div className='checkbox-container'>
                  <input className='circular-checkbox'
                    type="checkbox"
                    checked={checkedCells[generateCellKey(row, column)] || false}
                    onChange={() => {
                      onCheckboxChange(row, column);
                      const cellKey = generateCellKey(row, column);
                      onCellClick(cellKey);
                    }}
                  />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InterceptionTable;
