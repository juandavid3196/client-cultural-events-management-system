import React, { useState, Suspense, lazy } from 'react';
import EventsBySpaces from '../components/Reports/EventsBySpaces';
import EventsByModalities from '../components/Reports/EventsByModalities'
import AcomplishmentState from '../components/Reports/AcomplishmentState'


const ReportPage = () => {
    const [selectedChart, setSelectedChart] = useState('Todos');

    const handleChangeChart = (chartType) => {
        setSelectedChart(chartType);
    };

    const renderChartComponent = () => {
        switch (selectedChart) {
            case 'events-by-space':
                return <EventsBySpaces />;
            case 'events-by-modalities':
                return <EventsByModalities />;
            case 'acomplishment':
                return <AcomplishmentState />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex-col bg-gradient-to-r to-blue-800 from-white flex items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-4">Bienvenido a reportes</h1>
            <select value={selectedChart} onChange={(e) => handleChangeChart(e.target.value)}>
                <option value="Select">Seleccionar</option>
                <option value="events-by-space">Eventos por Espacio</option>
                <option value="events-by-modalities">Eventos por modalidades</option>
                <option value="acomplishment">Estado de las responsabilidades</option>
            </select>
            <Suspense fallback={<div>Cargando...</div>}>
                {renderChartComponent()}
            </Suspense>

        </div>
    );
};

export default ReportPage;
