import React, { useState } from 'react';
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

const spaceTypes = [
    { value: 'Sala', name: 'Sala' },
    { value: 'CafeTeatro', name: 'Cafe Teatro' },
    { value: 'Plazoleta', name: 'Plazoleta' },
    { value: 'AulaTaller', name: 'Aula Taller' },
    { value: 'Otros', name: 'Otros' },
];

const eventsBySpacesInfo = [
    {
        month: 'Enero',
        Sala: 7,
        CafeTeatro: 6,
        Plazoleta: 0,
        AulaTaller: 2,
        Otros: 1,
    }, {
        month: 'Febrero',
        Sala: 7,
        CafeTeatro: 2,
        Plazoleta: 3,
        AulaTaller: 9,
        Otros: 1,
    }, {
        month: 'Marzo',
        Sala: 4,
        CafeTeatro: 14,
        Plazoleta: 4,
        AulaTaller: 10,
        Otros: 2,
    }, {
        month: 'Abril',
        Sala: 17,
        CafeTeatro: 6,
        Plazoleta: 6,
        AulaTaller: 12,
        Otros: 5,
    }, {
        month: 'Mayo',
        Sala: 1,
        CafeTeatro: 8,
        Plazoleta: 2,
        AulaTaller: 2,
        Otros: 3,
    }, {
        month: 'Junio',
        Sala: 5,
        CafeTeatro: 11,
        Plazoleta: 9,
        AulaTaller: 8,
        Otros: 17,
    },
    {
        month: 'Julio',
        Sala: 16,
        CafeTeatro: 10,
        Plazoleta: 16,
        AulaTaller: 7,
        Otros: 15,
    },
    {
        month: 'Agosto',
        Sala: 12,
        CafeTeatro: 3,
        Plazoleta: 6,
        AulaTaller: 4,
        Otros: 2,
    },
    {
        month: 'Septiembre',
        Sala: 14,
        CafeTeatro: 3,
        Plazoleta: 7,
        AulaTaller: 0,
        Otros: 4,
    },
    {
        month: 'Octubre',
        Sala: 21,
        CafeTeatro: 1,
        Plazoleta: 4,
        AulaTaller: 0,
        Otros: 2,
    },
    {
        month: 'Noviembre',
        Sala: 0,
        CafeTeatro: 1,
        Plazoleta: 14,
        AulaTaller: 12,
        Otros: 15,
    },
    {
        month: 'Diciembre',
        Sala: 4,
        CafeTeatro: 4,
        Plazoleta: 3,
        AulaTaller: 5,
        Otros: 17,
    }
];

const EventsBySpaces = () => {
    const [selectedSpace, setSelectedSpace] = useState('Todos');

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
