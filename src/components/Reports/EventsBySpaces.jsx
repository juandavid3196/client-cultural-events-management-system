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


const EventsBySpaces = () => {
    const [selectedSpace, setSelectedSpace] = useState('Todos');
    const [eventsBySpacesInfo, setEventsBySpacesInfo] = useState([]);
    const [spaceTypes, setSpaceTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8007/api/events/count/spaces?year=2024');
                if (response.status === 200) {
                    const data = response.data;
                    setEventsBySpacesInfo(data.events_by_spaces_info);
                    setSpaceTypes(data.space_types);
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
                value={selectedSpace}
                onChange={(e) => setSelectedSpace(e.target.value)}
            >
                <option value="Todos">Todos</option>
                {spaceTypes.map((space) => (
                    <option key={space.value} value={space.value}>
                        {space.name}
                    </option>
                ))}
            </select>
            <Chart palette="Violet" dataSource={eventsBySpacesInfo}>
                <CommonSeriesSettings
                    argumentField="month"
                    type="line"
                />
                {selectedSpace === 'Todos'
                    ? spaceTypes.map((item) => (
                        <Series
                            key={item.value}
                            valueField={item.value}
                            name={item.name}
                        />
                    ))
                    : <Series valueField={selectedSpace} name={selectedSpace} />}
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
                <Title text="Eventos por espacio">
                    <Subtitle text="Total eventos por cada espacio" />
                </Title>
                <Tooltip enabled={true} />
            </Chart>
        </div>

    );
};

export default EventsBySpaces;
