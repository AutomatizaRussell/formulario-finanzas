import { SECTORES, SENIORS, SI_NO } from './options.js';

/**
 * Tipos de campo:
 *  - digits:   solo números (NIT)
 *  - text:     texto libre (con `uppercase` se normaliza a mayúsculas)
 *  - select:   lista de opciones
 *
 * `name` es el nombre que recibe n8n: no modificarlo.
 * El orden sigue las columnas del Excel de seguimiento.
 */
export const SECTIONS = [
  {
    id: 'entidad',
    title: 'Datos de la entidad informante',
    description: 'Información general de la compañía que reporta.',
    groups: [
      {
        columns: 2,
        fields: [
          {
            name: 'razon_social',
            label: 'Razón social de la entidad',
            type: 'text',
            uppercase: true,
            placeholder: 'Nombre o razón social',
          },
          {
            name: 'nit_razon_social',
            label: 'NIT de la razón social',
            type: 'digits',
            placeholder: 'Ej. 900123456',
            hint: 'Sin dígito de verificación.',
          },
          {
            name: 'sector',
            label: 'Sector al que pertenece',
            type: 'select',
            options: SECTORES,
            fullWidth: true,
          },
        ],
      },
    ],
  },
  {
    id: 'vinculados',
    title: 'Ubicación de entidades vinculadas',
    groups: [
      {
        columns: 2,
        fields: [
          {
            name: 'vinc_zona_franca',
            label: '¿Posee vinculados en zona franca?',
            type: 'select',
            options: SI_NO,
          },
          {
            name: 'vinc_exterior',
            label: '¿Posee vinculados en el exterior?',
            type: 'select',
            options: SI_NO,
          },
          {
            name: 'senior_cargo',
            label: 'Senior a cargo',
            type: 'select',
            options: SENIORS,
          },
          {
            name: 'razon_social_vinculados',
            label: 'Razón social de los vinculados',
            type: 'text',
            uppercase: true,
            placeholder: 'Nombres o razones sociales',
            hint: 'Si son varios, sepárelos con comas.',
          },
        ],
      },
    ],
  },
  {
    id: 'operaciones',
    title: 'Naturaleza de las operaciones',
    groups: [
      {
        columns: 1,
        fields: [
          {
            name: 'detalle_servicios',
            label: 'Venta de bienes o prestación de servicios',
            type: 'text',
            uppercase: true,
            placeholder: 'Describa la operación realizada con vinculados',
          },
          {
            name: 'detalle_prestamos',
            label: 'Saldos o movimientos de préstamos vigentes con vinculados',
            type: 'text',
            uppercase: true,
            placeholder: 'Indique condiciones o saldos pendientes',
          },
          {
            name: 'paises_no_cooperantes',
            label: 'Operaciones en jurisdicciones no cooperantes o de baja imposición',
            type: 'text',
            uppercase: true,
            placeholder: 'Especifique jurisdicción y tipo de operación',
          },
        ],
      },
    ],
  },
];

export const FILE_FIELD = {
  name: 'soporte_financiero',
  label: 'Archivo del acumulado por tercero',
  accept: ['.xlsx'],
  maxSizeMb: 20,
};

export const SUPPORT_SECTION = {
  id: 'acumulado',
  title: 'Acumulado por tercero a agosto 2026',
  description: 'Adjunte el soporte en formato Excel.',
};

export const ALL_FIELDS = SECTIONS.flatMap((section) =>
  section.groups.flatMap((group) => group.fields),
);
