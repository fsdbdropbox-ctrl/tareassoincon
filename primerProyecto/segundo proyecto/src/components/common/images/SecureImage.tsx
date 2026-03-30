import { useState, useEffect } from "react";
import { CircularProgress, Box, Dialog, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchImagePreview, downloadDocument } from "../../../api/documentService";
import { useTranslation } from "react-i18next";

interface Props {
    imageId?: string | number | null;
    alt?: string;
    width?: number;
    height?: number;
    clickable?: boolean;
}


export const SecureImage = ({ imageId, alt, width = 50, height = 50, clickable = false }: Props) => {

    const { t } = useTranslation();
    const resolvedAlt = alt ?? t('common.image.alt_material');

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

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



    const handleOpen = (e: React.MouseEvent) => {
        if (clickable && imageUrl) {
            e.stopPropagation();
            setOpenModal(true);
        }
    };


    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenModal(false);
    }

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!imageId) return;

        setIsDownloading(true);
        try {
            await downloadDocument(imageId.toString());
        } catch (error) {
            console.error("Error al descargar:", error);
            alert(t('common.image.download_error'));
        } finally {
            setIsDownloading(false);
        }
    }





    if (!imageId) {

        return (
            <Box
                sx={{ width, height, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, fontSize: '0.6rem', color: 'gray' }}
            >
                {t('common.status.no_image')}
            </Box>
        );
    }

    if (loading) {
        return <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={20} /></Box>;
    }

    if (error || !imageUrl) {
        return (
            <Box
                sx={{ width, height, bgcolor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, fontSize: '0.6rem', color: 'red' }}
            >
                {t('common.status.error')}
            </Box>
        );
    }

    return (
        <>

            <img
                src={imageUrl}
                alt={resolvedAlt}
                onClick={handleOpen}
                style={{
                    width,
                    height,
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    cursor: clickable ? 'pointer' : 'default'
                }}
            />
            {clickable && (
                <Dialog open={openModal} onClose={handleClose} maxWidth="md">
                    <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black', display: 'flex', justifyContent: 'center', minWidth: '300px' }}>
                        <IconButton
                            onClick={handleClose}
                            sx={{ position: 'absolute', right: 8, top: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <img src={imageUrl} alt={resolvedAlt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                        <Button
                            variant="contained"
                            startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                            onClick={handleDownload}
                            disabled={isDownloading}
                            sx={{ backgroundColor: isDownloading ? "gray" : "#298d29", '&:hover': { backgroundColor: "#1e6b1e" } }}
                        >
                            {isDownloading ? t('common.status.downloading') : t('common.buttons.download_original')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};