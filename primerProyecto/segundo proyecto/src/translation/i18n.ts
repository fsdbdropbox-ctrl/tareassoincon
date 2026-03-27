import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import languagDetector from 'i18next-browser-languagedetector';
const resources = {
    es: {
        translation: {
            "common": {
                "buttons": {
                    "save": "Guardar",
                    "save_changes": "Guardar Cambios",
                    "cancel": "Cancelar",
                    "clear": "Limpiar",
                    "search": "Buscar",
                    "back": "← Volver",
                    "edit_selected": "Editar Seleccionado",
                    "delete_selected": "- Eliminar ({{count}})",
                    "delete_image": "Eliminar Imagen",
                    "delete_selected_long": "- Borrar Seleccionados ({{count}})"
                },
                "status": {
                    "loading": "Cargando...",
                    "no_image": "Sin img",
                    "error": "Error",
                    "unknown": "Desconocido",
                    "unassigned": "Sin asignar",
                    "na": "N/A",
                    "deleting": "Borrando de la BBDD...",
                    "select_option": "Seleccione una unidad..."
                },
                "validation": {
                    "required": "Obligatorio",
                    "code_req": "El código es requerido",
                    "name_req": "El nombre es requerido",
                    "unit_req": "La unidad de medida es requerida",
                    "type_req": "El tipo es requerido",
                    "negative_amount": "La cantidad no puede ser negativa",
                    "select_material": "Debe seleccionar un material"
                },
                "filters": {
                    "code": "Código",
                    "name": "Nombre",
                    "externalCode": "Código Externo",
                    "description": "Descripción"
                },
                "image": {
                    "col_header": "Img",
                    "delete_confirm": "¿Seguro que quieres borrar la imagen de la base de datos? Esta acción no se puede deshacer.",
                    "delete_error": "Hubo un error al intentar borrar la imagen del servidor.",
                    "drag_drop": "Arrastra tu imagen o <span class=\"filepond--label-action\">Examina</span>"
                },
                "alerts": {
                    "delete_confirm_count": "¿Seguro que quieres borrar {{count}} elementos seleccionados?",
                    "delete_success": "Elementos borrados correctamente",
                    "delete_error": "Error al eliminar. Es posible que haya un problema de base de datos.",
                    "delete_error_in_use": "Error al borrar. Es posible que el elemento esté en uso o haya un problema de base de datos.",
                    "save_success": "Datos guardados correctamente",
                    "save_error": "Hubo un error al guardar. Revisa los datos."
                }
            },
            "materials": {
                "view_title": "Materiales",
                "add_button": "+ Agregar Material",
                "columns": {
                    "measure_unit": "Unidad de Medida",
                    "type": "Tipo de Material",
                    "observations": "Observaciones",
                    "stock": "Stock Físico"
                },
                "types": {
                    "raw": "Materia Prima",
                    "semi": "Semielaborado",
                    "finished": "Producto Terminado",
                    "virtual": "Es Virtual",
                    "other": "Otro"
                },
                "dialog": {
                    "create_title": "Nuevo Material",
                    "edit_title": "Editar Material General",
                    "image_title": "Imagen del Material",
                    "type_title": "Tipo de Material"
                }
            },
            "locations": {
                "view_title": "Localizaciones",
                "add_button": "+ Nueva Localización",
                "columns": {
                    "allow_storage": "Permite Almacenar",
                    "management": "Gestión",
                    "allow_requests": "Permite Solicitudes"
                },
                "management_types": {
                    "chaotic": "Caótica",
                    "ordered": "Ordenada"
                },
                "dialog": {
                    "create_title": "Crear Localización",
                    "edit_title": "Editar Localización",
                    "image_new": "Subir Imagen de la Localización",
                    "image_edit": "Sustituir Imagen Actual"
                }
            },
            "location_materials": {
                "view_title": "Localización:",
                "add_button": "+ Añadir Material a Localización",
                "delete_button": "- Eliminar Materiales seleccionados ({{count}})",
                "columns": {
                    "mat_id": "Id del Material",
                    "mat_name": "Nombre del Material",
                    "quantity": "Cantidad",
                    "is_default": "Ubicación Principal?"
                },
                "dialog": {
                    "create_title": "Asignar Material a la Localización",
                    "edit_title": "Editar Asignación",
                    "material_label": "Material"
                }
            },
        }
    },
    en: {
        translation: {
            "common": {
                "buttons": {
                    "save": "Save",
                    "save_changes": "Save Changes",
                    "cancel": "Cancel",
                    "clear": "Clear",
                    "search": "Search",
                    "back": "← Go Back",
                    "edit_selected": "Edit Selected",
                    "delete_selected": "- Delete ({{count}})",
                    "delete_image": "Delete Image",
                    "delete_selected_long": "- Delete Selected ({{count}})"
                },
                "status": {
                    "loading": "Loading...",
                    "no_image": "No img",
                    "error": "Error",
                    "unknown": "Unknown",
                    "unassigned": "Unassigned",
                    "na": "N/A",
                    "deleting": "Deleting from DB...",
                    "select_option": "Select a unit..."
                },
                "validation": {
                    "required": "Required",
                    "code_req": "Code is required",
                    "name_req": "Name is required",
                    "unit_req": "Measure unit is required",
                    "type_req": "Type is required",
                    "negative_amount": "Amount cannot be negative",
                    "select_material": "You must select a material"
                },
                "filters": {
                    "code": "Code",
                    "name": "Name",
                    "externalCode": "External Code",
                    "description": "Description"
                },
                "image": {
                    "col_header": "Img",
                    "drag_drop": "Drag & Drop your picture or <span class=\"filepond--label-action\">Browse</span>",
                    "delete_confirm": "Are you sure you want to delete the image from the database? This action cannot be undone.",
                    "delete_error": "There was an error trying to delete the image from the server."
                }
            },
            "materials": {
                "view_title": "Materials",
                "add_button": "+ Add Material",
                "columns": {
                    "measure_unit": "Measure Unit",
                    "type": "Material Type",
                    "observations": "Observations",
                    "stock": "Physical Stock"
                },
                "types": {
                    "raw": "Raw Material",
                    "semi": "Semifinished",
                    "finished": "Finished Product",
                    "virtual": "Is Virtual",
                    "other": "Other"
                },
                "dialog": {
                    "create_title": "New Material",
                    "edit_title": "Edit General Material",
                    "image_title": "Material Image",
                    "type_title": "Material Type"
                }
            },
            "locations": {
                "view_title": "Locations",
                "add_button": "+ New Location",
                "columns": {
                    "allow_storage": "Allows Storage",
                    "management": "Management",
                    "allow_requests": "Allows Requests"
                },
                "management_types": {
                    "chaotic": "Chaotic",
                    "ordered": "Ordered"
                },
                "dialog": {
                    "create_title": "Create Location",
                    "edit_title": "Edit Location",
                    "image_new": "Upload Location Image",
                    "image_edit": "Replace Current Image"
                }
            },
            "location_materials": {
                "view_title": "Location:",
                "add_button": "+ Add Material to Location",
                "delete_button": "- Delete Selected Materials ({{count}})",
                "columns": {
                    "mat_id": "Material Id",
                    "mat_name": "Material Name",
                    "quantity": "Quantity",
                    "is_default": "Main Location?"
                },
                "dialog": {
                    "create_title": "Assign Material to Location",
                    "edit_title": "Edit Assignment",
                    "material_label": "Material"
                }
            },
            "alerts": {
                "delete_confirm_count": "Are you sure you want to delete {{count}} selected items?",
                "delete_success": "Items successfully deleted",
                "delete_error": "Error deleting. There might be a database issue.",
                "delete_error_in_use": "Error deleting. The item might be in use or there is a database issue.",
                "save_success": "Data successfully saved",
                "save_error": "There was an error saving. Please check the data."
            }
        }
    }
};

const browserLanguage = navigator.language;
const shortLang = browserLanguage.split('-')[0];

const startingLanguage = shortLang === "es" ? "es" : "en";

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: startingLanguage,
        fallbackLng: "en",
        load: 'languageOnly',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;