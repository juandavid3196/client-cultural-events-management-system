import { ResponsibilityTable } from '../components/DeliverResponsibility/ResponsabilityTable';
import ListEvent from '../components/listEvent/listEvent';
const Responsibility = ({ nameEvent }) => {
  return (
    <div className='text-2xl h-auto w-full bg-main'>
      <h1 className="text-4xl font-bold text-center mb-2 py-2">Cumplimiento de Responsabilidades</h1>   
        <ListEvent />    
    </div>
  );
}

export default Responsibility;
