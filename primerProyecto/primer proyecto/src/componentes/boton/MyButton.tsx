interface Props {
    texto: string;
}

export const MyButton = ({texto}: Props)=> {
    return (
        <button>{texto}</button>
    );
};