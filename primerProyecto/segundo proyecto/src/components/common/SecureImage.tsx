import { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { fetchImagePreview } from "../../api/documentService";

interface Props {

    imageId?: string | number | null;
    alt?: string;
    width?: number;
    height?: number;
}


export const SecureImage = ({ imageId, alt, width = 50, height = 50 }: Props) => {

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!imageId) return;
        let isMounted = true;
        setLoading(true);
        setError(false);

        fetchImagePreview(imageId.toString())
            .then((url) => {
                if (isMounted) setImageUrl(url);
            })
            .catch(() => {
                if (isMounted) setError(true);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });


        return () => {
            isMounted = false;

            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };

    }, [imageId]);

    if (!imageId) {

        return <Box sx={{ width, height, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, fontSize: '0.6rem', color: 'gray' }}>Sin img</Box>;
    }

    if (loading) {
        return <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={20} /></Box>;
    }

    if (error || !imageUrl) {
        return <Box sx={{ width, height, bgcolor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, fontSize: '0.6rem', color: 'red' }}>Error</Box>;
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            style={{ width, height, objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
        />
    )

}