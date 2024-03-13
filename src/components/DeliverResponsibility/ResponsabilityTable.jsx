import React, { useState } from 'react';
import { FileInput } from '../UserActions/FileInput';

const ResponsibilityTable = () => {
  // Eliminamos la definición de tipo del estado
  const [data, setData] = useState([]);

  const generateRandomData = () => {
    const names = ["Nombre 1", "Nombre 2", "Nombre 3", "Nombre 4"];
    const statuses = ["Pendiente"];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Generar fechas aleatorias dentro del rango de, por ejemplo, los últimos 30 días
    const currentDate = new Date();
    const creationDate = new Date(currentDate.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const completionDate = new Date(creationDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);

    // Formatear fechas como cadenas de texto
    const formattedCreationDate = creationDate.toISOString().split('T')[0];
    const formattedCompletionDate = completionDate.toISOString().split('T')[0];

    return { Name: randomName, Status: randomStatus, CreationDate: formattedCreationDate, CompletionDate: formattedCompletionDate };
  };

  const addDataToTable = () => {
    // Generar datos aleatorios y agregarlos a la tabla
    const newData = generateRandomData();
    setData([...data, newData]);
  };

  const getStatusColor = (Status) => {
    switch (Status) {
      case 'Aprobado':
        return 'bg-green-400';
      case 'En proceso':
        return 'bg-yellow-400';
      case 'Pendiente':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className='bg-white flex flex-col gap-4'>
      <button onClick={addDataToTable}>
        Agregar Fila Aleatoria
      </button>

      <div>
        <table className="custom-table bg-white' table-auto w-full" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Responsabilidad</th>
              <th>Fecha de creación</th>
              <th>Fecha de entrega</th>
              <th>Estado</th>
              <th>Subir Entregable</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className='text-center'>
                <td className='text-gray-title'>{item.Name}</td>
                <td className='text-gray-title'>{item.CreationDate}</td>
                <td className='text-gray-title'>{item.CompletionDate}</td>
                <td className={`${getStatusColor(item.Status)} text-white text-center font-semibold`}>
                  {item.Status}
                </td>
                <td className='flex flex-row justify-center'>
                  <FileInput />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { ResponsibilityTable };
