import React, { useEffect, useState } from 'react';
import "../stateReport/StateReport.scss";
import crudService from '../../services/crudService';

const StateReport = ({ onCloseReport }) => {

    const [close, setClose] = useState(false);
    const [originalReport, setOriginalReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [states, setStates] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [fullStates, setFullStates] = useState([]);

    const [reportData, setReportData] = useState({
        name: '',
        state_id: '',
        date_start: '',
        date_finish: ''
    })

    useEffect(() => {
        getModalities();
        getSpaces();
        getFullStates();
        getStates();
        getReports();
    }, [])

    useEffect(() => {
        applyFilters();
    }, [reportData, originalReport]);

    const handleClose = () => {
        setClose(true);
        setTimeout(() => {
            onCloseReport();
        }, 500)
    }

    const getReports = async () => {

        try {
            const data = await crudService.fetchItems('events');
            const eventsReport = [];

            if (data.length > 0)
                for (let i = 0; i < data.length; i++) {

                    eventsReport.push({
                        id: data[i].id,
                        general_name: data[i].general_name,
                        event_type_id: data[i].event_type_id,
                        date_start: data[i].date_start,
                        date_finishing: data[i].date_finishing,
                        place_id: data[i].place_id,
                        state: getStateById(data[i].id),
                    });
                }
            setOriginalReport(eventsReport);
        } catch (error) {
            console.error('Error al cargar los eventos:', error);
        }
    };

    const applyFilters = () => {
        const filtered = originalReport.filter(filterEvents);
        setFilteredReport(filtered);
    };

    const filterEvents = (event) => {
        const nameMatch = event.general_name.toLowerCase().includes(reportData.name.toLowerCase());
        const stateMatch = reportData.state_id === '' || event.state === reportData.state_id;
        const dateStartMatch = reportData.date_start === '' || event.date_start >= reportData.date_start;
        const dateFinishMatch = reportData.date_finish === '' || event.date_finishing <= reportData.date_finish;

        return nameMatch && stateMatch && dateStartMatch && dateFinishMatch;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportData({
            ...reportData,
            [name]: value,
        });

    }


    const getStateById = (id) => {
        const foundState = fullStates.find((element) => element.event_id === id);

        if (foundState) {
            const state = states.find((elem) => elem.id === foundState.state_id);
            if (state) {
                return state.name;
            }
        }
        return null;
    }


    const typeModalityFilter = (id) => {
        const foundState = modalities.find((element) => element.id === id);
        return foundState.name;
    }


    const typePlaceFilter = (id) => {
        const foundState = spaces.find((element) => element.id === id);
        return foundState.name;
    }

    //CRUD opeartions

    const getStates = async () => {
        const data = await crudService.fetchItems('states');
        setStates(data);
    }

    const getFullStates = async () => {
        let data = await crudService.fetchItems('eventstate');
        setFullStates(data);
    }

    const getModalities = async () => {
        const data = await crudService.fetchItems('contractual-modes');
        setModalities(data);
    }

    const getSpaces = async () => {
        const data = await crudService.fetchItems('spaces');
        setSpaces(data);
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
                                    <option value=''>Ninguno</option>
                                    {
                                        states.map((element, index) => (
                                            <option key={index} value={`${element.id}`}>{`${element.name}`}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="filter-box date-filter">
                                <div className="filter-second-box">
                                    <label htmlFor="date_start">de</label>
                                    <input type="date" name="date_start" onChange={handleInputChange} value={reportData.date_start} />
                                </div>
                                <div className="filter-second-box">
                                    <label htmlFor="date_finish"> Hasta </label>
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
                                    filteredReport.length > 0 && filteredReport.map((elem, index) => (
                                        <tr key={index}>
                                            <td>{elem.general_name}</td>
                                            {<td>{typeModalityFilter(elem.event_type_id)}</td>}
                                            <td>{elem.date_start}</td>
                                            <td>{elem.date_finishing}</td>
                                            {<td>{typePlaceFilter(elem.place_id)}</td>}
                                            <td>{elem.state}
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