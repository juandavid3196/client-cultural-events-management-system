import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Chart,
    Series,
    ArgumentAxis,
    CommonSeriesSettings,
    Export,
    Legend,
    Margin,
    Title,
    Subtitle,
    Tooltip,
    Grid,
} from 'devextreme-react/chart';

const EventsByModalities = () => {
    const [selectedMode, setSelectedMode] = useState('Todos');
    const [eventsInfo, setEventsInfo] = useState([]);
    const [modeTypes, setModeTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8007/api/events/count/modes?year=2024');
                if (response.status === 200) {
                    const data = response.data;
                    setEventsInfo(data.events_by_mode_info);
                    setModeTypes(data.mode_types);
                } else {
                    console.error(`Error en la petición: ${response.status}`);
                }
            } catch (error) {
                console.error('Error al hacer la petición:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-lg p-8 shadow-md w-5/6">
            <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
            >
                <option value="Todos">Todos</option>
                {modeTypes.map((source) => (
                    <option key={source.value} value={source.value}>
                        {source.name}
                    </option>
                ))}
            </select>
            <Chart palette="Violet" dataSource={eventsInfo}>
                <CommonSeriesSettings
                    argumentField="month"
                    type="line"
                />
                {selectedMode === 'Todos'
                    ? modeTypes.map((item) => (
                        <Series
                            key={item.value}
                            valueField={item.value}
                            name={item.name}
                        />
                    ))
                    : <Series valueField={selectedMode} name={selectedMode} />}
                <Margin bottom={20} />
                <ArgumentAxis
                    valueMarginsEnabled={false}
                    discreteAxisDivisionMode="crossLabels"
                >
                    <Grid visible={true} />
                </ArgumentAxis>
                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center"
                    itemTextPosition="bottom"
                />
                <Export enabled={true} />
                <Title text="Eventos por modalidad contractual">
                    <Subtitle text="Total eventos de cada modalidad por mes" />
                </Title>
                <Tooltip enabled={true} />
            </Chart>
        </div>
    );
};

export default EventsByModalities;
