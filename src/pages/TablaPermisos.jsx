import { useState, useEffect } from "react";
import EditPermision from "../components/Dialogs/EditPermision/EditPermision";
import axios from "axios";
import InterceptionTable from "../components/InterceptionTable/InterceptionTable";
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [checkedCells, setCheckedCells] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [keyId, setkeyID] = useState([]);
  const [columns, setColumns] = useState([]);
  const [modeId, setModeId] = useState(null);
  const [modeName, setmodeName] = useState("");
  const [selectedCellKey, setSelectedCellKey] = useState("");
  const [idUpdate, setIdUpdate] = useState(null);
  const [responseData, setResponseData] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const modeIdurl = searchParams.get('modeId');
  const valorNumerico = modeIdurl;

  useEffect(() => {
    const modeId2 = typeof valorNumerico === 'string' ? parseInt(valorNumerico, 10) : null;
    if (modeId !== modeId2) {
      setModeId(modeId2);
    }
  }, [valorNumerico, modeId]);

  const handleConfirm = () => {
    if (idUpdate !== null) {
      const itemToUpdate = responseData.find((item) => item.id === idUpdate);
      if (itemToUpdate) {
        const updatedItem = { ...itemToUpdate, applies: !itemToUpdate.applies };
        axios.patch(`http://localhost:8007/api/responsability-by-mode/${idUpdate}`, updatedItem)
          .then((response) => {
            if (response.status === 200) {
              setResponseData((prevData) =>
                prevData.map((item) => (item.id === idUpdate ? updatedItem : item))
              );
              setCheckedCells((prevCheckedCells) => ({
                ...prevCheckedCells,
                [`${itemToUpdate.responsability_name}-${itemToUpdate.space_name}`]: updatedItem.applies,
              }));
            }
          })
          .catch((error) => {
            console.error('Error al actualizar:', error);
          });
      }
    }
  };

  const handleCellClick = (cellKey) => {
    setSelectedCellKey(cellKey);
  };

  const handleCheckboxChange = (responsability, space) => {
    if (modeId !== null) {
      const id = findIdByCriteria(responseData, modeId, responsability, space);
      setIdUpdate(id);
    }
    setDialogOpen(true);
  };

  function findIdByCriteria(data, modeId, responsabilityName, spaceName) {
    for (const item of data) {
      if (modeId !== null && item.mode_id === modeId && item.responsability_name === responsabilityName && item.space_name === spaceName) {
        return item.id;
      }
    }
    return null;
  }

  useEffect(() => {
    if (modeId !== null) {
      axios.get(`http://localhost:8007/api/responsability-by-mode?skip=0&limit=125&mode_id=${modeId}`).then((response) => {
        if (response.status === 200) {
          const responseData = response.data;
          setResponseData(responseData);
          const rows = Array.from(new Set(responseData.map((item) => item.responsability_name.toString())));
          const columns = Array.from(new Set(responseData.map((item) => item.space_name.toString())));
          const keyId = Array.from(new Set(responseData.map((item) => item.id.toString())));
          const modeName = responseData.length > 0 ? responseData[0].mode_name : "Modo Desconocido";
          setmodeName(modeName);
          const initialCheckedCells = {};
          responseData.forEach((item) => {
            if (item.applies) {
              initialCheckedCells[`${item.responsability_name}-${item.space_name}`] = true;
            }
          });
          setRows(rows);
          setColumns(columns);
          setCheckedCells(initialCheckedCells);
          setkeyID(keyId);
        }
      });
    }
  }, [modeId]);

  return (
    <div className="bg-black h-full w-full flex text-white">
      <main className="w-full p-2 bg-main">
        <div className="flex flex-col items-center px-6">
          <div className="py-6 flex flex-col items-center">
            <h1 className="text-gray-title font-bold text-4xl">Gestión de Responsabilidades</h1>
            <h1 className="capitalize text-gray-title font-bold text-4xl">{modeName}</h1>
          </div>
          <InterceptionTable
            title="Responsabilidad"
            keyId={keyId}
            rows={rows}
            columns={columns}
            initialCheckedCells={checkedCells}
            onCheckboxChange={handleCheckboxChange}
            onCellClick={handleCellClick}
          />
          <EditPermision open={dialogOpen} setDialogOpen={setDialogOpen} responsabilidad={selectedCellKey} onConfirm={handleConfirm} />
        </div>
      </main>
    </div>
  );
};

export default Home;
