const Button = ({ text, type, handleClick = () => { } }) => {
    return (
        <button
            onClick={handleClick}
            className={`bg-white ${type === 'primary' ? 'px-8 py-2 font-bold' : 'px-3 py-2 font-semibold'} rounded-full hover:scale-105`}>
            <span className="text-md text-black">{text}</span>
        </button>
    );
}

export { Button };
