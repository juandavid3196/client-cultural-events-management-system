import React, { useState, useEffect } from "react";
import axios from 'axios';
import PieChart, {
    Series, Label, Connector, Size, Export,
} from 'devextreme-react/pie-chart';

function App() {
    const [acomplishment, setAcomplishment] = useState([
        {
            valor: 'total',
            total: 0,
        },
        {
            valor: 'no completadas',
            total: 0,
        },
        {
            valor: 'completadas',
            total: 0,
        },
    ]);

    useEffect(() => {
        const fetchAcomplishmentData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8007/api/events/all/status?start_date=01%2F05%2F2024&end_date=30%2F05%2F2024`
                );

                setAcomplishment([
                    { valor: 'total', total: response.data.total },
                    { valor: 'no completadas', total: response.data.not_complete },
                    { valor: 'completadas', total: response.data.complete },
                ]);
            } catch (error) {
                console.error("Error al obtener los datos de las reponsabilidades:", error);
            }
        };

        fetchAcomplishmentData();
    }, []);

    function pointClickHandler(e) {
        toggleVisibility(e.target);
    }

    function legendClickHandler(e) {
        const arg = e.target;
        const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];
        toggleVisibility(item);
    }

    function toggleVisibility(item) {
        item.isVisible() ? item.hide() : item.show();
    }

    return (
        <div className="bg-white rounded-lg p-8 shadow-md w-3/6">
            <PieChart
                id="pie"
                dataSource={acomplishment}
                palette="Bright"
                title="Estado total de las responsabilidades"
                onPointClick={pointClickHandler}
                onLegendClick={legendClickHandler}
            >
                <Series
                    argumentField="valor"
                    valueField="total"
                >
                    <Label visible={true}>
                        <Connector
                            visible={true}
                            width={1}
                        />
                    </Label>
                </Series>

                <Size width={500} />
                <Export enabled={true} />
            </PieChart>
        </div>
    );
}

export default App;