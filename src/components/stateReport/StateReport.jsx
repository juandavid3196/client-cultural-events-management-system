import React, { useEffect, useState } from 'react';
import "../stateReport/StateReport.scss";
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';

const StateReport = ({ onCloseReport, openReport }) => {

    const [close, setClose] = useState(false);
    const [originalReport, setOriginalReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const { typeEventFilter, typeStateFilter, typePlaceFilter, colorState } = useAppContext();

    const [reportData, setReportData] = useState({
        name: '',
        type_state: '',
        date_start: '',
        date_finish: ''
    })

    useEffect(() => {
        if (openReport) {
            getReports();
        }
    }, [openReport]);

    useEffect(() => {
        applyFilters();
    }, [reportData, originalReport]);

    const arrangedEvents = filteredReport.sort((a, b) => new Date(b.date_state) - new Date(a.date_state));

    const handleClose = () => {
        setClose(true);
        setTimeout(() => {
            onCloseReport();
        }, 500)
    }

    const applyFilters = () => {
        const filtered = originalReport.filter(filterEvents);
        setFilteredReport(filtered);
    };

    const getReports = async () => {
        let data = null;
        data = await crudService.fetchItems('report');
        setOriginalReport(data);
        setFilteredReport(data);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData({
            ...reportData,
            [name]: value,
        });

    }

    const filterEvents = (event) => {
        const nameMatch = event.general_name.toLowerCase().includes(reportData.name.toLowerCase());
        const stateMatch = reportData.type_state === '' || event.type_state === reportData.type_state;
        const dateStartMatch = reportData.date_start === '' || event.date_start >= reportData.date_start;
        const dateFinishMatch = reportData.date_finish === '' || event.date_finishing <= reportData.date_finish;

        return nameMatch && stateMatch && dateStartMatch && dateFinishMatch;
    };


    return (
        <div className={`state-report-big-container ${close ? 'close' : ''}`}>
            <div className={`state-report-container ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Reporte de Estados`}</span>
                    <i className="fa-regular fa-circle-xmark" onClick={handleClose}></i>
                </div>
                <main>
                    <div className="event-section">

                        <div className="filter-container">
                            <div className="filter-box">
                                <label htmlFor="">Nombre</label>
                                <input className='name-input' name='name' type="text" placeholder='Nombre del Evento' onChange={handleInputChange} value={reportData.name} />
                            </div>
                            <div className="filter-box">
                                <label htmlFor="">Estado</label>
                                <select name="type_state" onChange={handleInputChange} value={reportData.type_state}>
                                    <option value="" selected>Todos</option>
                                    <option value="pre-reserva">Pre-reserva</option>
                                    <option value="confirmado">Confirmado</option>
                                    <option value="ejecutar">Listo para Ejecutar</option>
                                    <option value="cancelado">Cancelado</option>
                                    <option value="ejecucion">En Ejecución</option>
                                    <option value="terminado">Terminado</option>
                                </select>
                            </div>
                            <div className="filter-box date-filter">
                                <div className="filter-second-box">
                                    <label htmlFor="">de</label>
                                    <input type="date" name="date_start" onChange={handleInputChange} value={reportData.date_start} />
                                </div>
                                <div className="filter-second-box">
                                    <label htmlFor=""> Hasta </label>
                                    <input type="date" name='date_finish' onChange={handleInputChange} value={reportData.date_finish} />
                                </div>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <td>Evento</td>
                                    <td>Tipo de Evento</td>
                                    <td>Fecha Inicio</td>
                                    <td>Fecha Finalización</td>
                                    <td>Lugar</td>
                                    <td>Estado</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    arrangedEvents.length > 0 && arrangedEvents.map((elem, index) => (
                                        <tr key={index}>
                                            <td>{elem.general_name}</td>
                                            <td>{typeEventFilter(elem.event_type)}</td>
                                            <td>{elem.date_start}</td>
                                            <td>{elem.date_finishing}</td>
                                            <td>{typePlaceFilter(elem.place)}</td>
                                            <td className='state-cell'>{typeStateFilter(elem.type_state)}
                                                <span className='state-circle' style={{ backgroundColor: colorState(elem.type_state) }}></span>
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </main>
            </div >
        </div >
    )
}

export default StateReport