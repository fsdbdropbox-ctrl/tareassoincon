import { useParams } from "react-router-dom";

export const LocationMaterials = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>LocationMaterials</h1>
        </div>
    )
}

