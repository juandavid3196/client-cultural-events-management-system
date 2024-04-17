import React, { useEffect, useState } from 'react';
import "../stateReport/StateReport.scss";
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';

const StateReport = ({ onCloseReport, openReport }) => {

    const [close, setClose] = useState(false);
    const [originalReport, setOriginalReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [states, setStates] = useState([]);
    const { typeModalityFilter, typeStateFilter, typePlaceFilter } = useAppContext();

    const [reportData, setReportData] = useState({
        name: '',
        state_id: '',
        date_start: '',
        date_finish: ''
    })

    useEffect(() => {
        getStates();
    }, [])

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


    const getStates = async () => {
        const data = await crudService.fetchItems('states');
        setStates(data);
    }


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
                                <label htmlFor="state_id">Estado</label>
                                <select name="state_id" onChange={handleInputChange} value={reportData.state_id}>
                                    {
                                        states.map((element, index) => (
                                            <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="filter-box date-filter">
                                <div className="filter-second-box">
                                    <label htmlFor="">de</label>
                                    <input type="date" name="date_start" onChange={handleInputChange} value={reportData.date_start} />
                                </div>
                                <div className="filter-second-box">
                                    <label htmlFor=""> Hasta </label>
                                    <input type="date" name='date_finish' onChange={handleInputChange} value={reportData.date_finish} min={reportData.date_start} />
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
                                            <td>{typeModalityFilter(elem.event_type)}</td>
                                            <td>{elem.date_start}</td>
                                            <td>{elem.date_finishing}</td>
                                            <td>{typePlaceFilter(elem.place)}</td>
                                            <td>{typeStateFilter(elem.type_state)}
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