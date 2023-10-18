import { MdShield } from 'react-icons/md'
import { Card } from './CardOptions'
import { TeatroIcon } from './IconsSVG/TeatroIcon';

interface SidebarProps {
    onCardOptionClick: (modeId: number) => void;
  }

const Sidebar = ({ onCardOptionClick }: SidebarProps) => {
    return (
        <aside className=" bg-sideBar w-[670px] flex flex-col">
            <div className="bg-svg-fond">
                <div><TeatroIcon /></div>
            </div>
            <div className="h-full flex flex-col gap-6">
                <Card
                    options={[<p onClick={() => onCardOptionClick(1)}>Alquiler</p>,
                    <p onClick={() => onCardOptionClick(2)}>Propio</p>,
                    <p onClick={() => onCardOptionClick(3)}>Proyecto</p>,
                    <p onClick={() => onCardOptionClick(4)}>Co-Producción</p>,
                    <p onClick={() => onCardOptionClick(5)}>Apoyo</p>,
                    <p onClick={() => onCardOptionClick(6)}>Canje</p>
                ]}
                    text='Permisos'
                    icon={<MdShield />} />
            </div>
        </aside>
    )
}

export { Sidebar }