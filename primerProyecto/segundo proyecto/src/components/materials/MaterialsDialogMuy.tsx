import * as Yup from "yup";

export const materialValidationSchema = Yup.object().shape({
    code: Yup.string().required("El código es requerido"),
    name: Yup.string().required("El nombre es requerido"),
    measureUnitId: Yup.number().required("La unidad de medida es requerida"),

    isVirtual: Yup.boolean().required("El tipo es requerido"),
    isRawMaterial: Yup.boolean().required("El tipo es requerido"),
    isSemifinished: Yup.boolean().required("El tipo es requerido"),
    isFinished: Yup.boolean().required("El tipo es requerido"),
});