import { Dialog, DialogContent, DialogTitle, Link } from "@mui/material";
import { Button } from "../../Button/Button";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const EditPermision = ({ open, setDialogOpen, responsabilidad, onConfirm }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const modeId = searchParams.get('modeId');
    const navigate = useNavigate();

    const handleConfirm = () => {
        onConfirm();
        setDialogOpen(false);

        // Obtener el modeId actual de la URL
        const currentModeId = modeId;

        // Forzar la recarga solo si modeId está presente en la URL
        if (currentModeId) {
            // Actualizar el valor de modeId para forzar la recarga del componente Home
            navigate(`/TablaPermisos?modeId=${currentModeId}`);
            window.location.reload(); // Recargar la página
        }
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    return (
        <Dialog open={open}>
            <DialogTitle className="bg-main">
                <span className="font-bold">Verificación de cambio</span>
            </DialogTitle>

            <DialogContent className="bg-main">
                <div className="flex flex-row items-center justify-center gap-5">
                    <span>
                        Vas a cambiar la responsabilidad{" "}
                        <span className="font-bold">{responsabilidad}</span> ¿Estás seguro?
                    </span>
                    <Button
                        text={"Sí"}
                        type="secondary"
                        handleClick={handleConfirm}
                    />
                    <Button text={"No"} type="secondary" handleClick={handleCancel} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditPermision;
