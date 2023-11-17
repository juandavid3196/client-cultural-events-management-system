import React, { useEffect, useState } from 'react';
import "../stateReport/StateReport.scss";
import crudService from '../../services/crudService';
import { useAppContext } from '../../contexts/AppContext';

const StateReport = ({ onCloseReport, openReport }) => {

    const [close, setClose] = useState(false);
    const [report, setReport] = useState([]);
    const { typeEventFilter, typeStateFilter, typePlaceFilter, colorState } = useAppContext();

    useEffect(() => {
        getReports();
    }, openReport)

    const arrangedEvents = report.sort((a, b) => new Date(b.date_state) - new Date(a.date_state));

    const handleClose = () => {
        setClose(true);
        setTimeout(() => {
            onCloseReport();
        }, 500)
    }

    const getReports = async () => {
        let data = null;
        data = await crudService.fetchItems('report');
        setReport(data);
    }

    return (
        <div className={`state-report-big-container ${close ? 'close' : ''}`}>
            <div className={`state-report-container ${close ? 'close' : ''}`}>
                <div className='form-title'>
                    <span>{`Estados`}</span>
                    <i class="fa-regular fa-circle-xmark" onClick={handleClose}></i>
                </div>
                <main>
                    <div className="event-section">
                        <div className="section-title">
                            <span>Reporte de Estados</span>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <td>Evento</td>
                                    <td>Tipo de Evento</td>
                                    <td>Fecha Inicio</td>
                                    <td>Fecha Finilazación</td>
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