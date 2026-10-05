// Catálogos de opciones. Los `value` se envían tal cual al flujo de n8n: no modificarlos.

export const SI_NO = [
  { value: 'NO', label: 'No' },
  { value: 'SI', label: 'Sí' },
];

export const SECTORES = [
  { value: 'EDUCACION', label: 'Educación' },
  { value: 'SERVICIOS_FINANCIEROS_SEGUROS', label: 'Servicios financieros y de seguros' },
  { value: 'CONSTRUCCION_INMOBILIARIA', label: 'Construcción e inmobiliaria' },
  { value: 'OTROS_SERVICIOS', label: 'Otros servicios' },
  { value: 'ENERGIA_PETROLEO_GAS', label: 'Energía, petróleo y gas' },
  { value: 'SECTOR_FARMACEUTICO', label: 'Sector farmacéutico' },
  { value: 'ENTIDADES_SIN_ANIMO_LUCRO', label: 'Entidades sin ánimo de lucro' },
  { value: 'SECTOR_TIC', label: 'Sector TIC' },
  { value: 'OTROS_SECTORES_ESPECIFICOS', label: 'Otros sectores específicos' },
  { value: 'MANUFACTURA', label: 'Manufactura' },
  { value: 'SECTOR_ALIMENTOS', label: 'Sector alimentos' },
  { value: 'SECTOR_HOTELERIA', label: 'Sector hotelería' },
  { value: 'SECTOR_COMERCIALIZACION', label: 'Sector comercialización' },
  { value: 'SECTOR_TRANSPORTE', label: 'Sector transporte' },
  { value: 'SALUD', label: 'Salud' },
];

const SENIOR_NAMES = {
  ALEJANDRA_CORREA_QUINTERO: 'Alejandra Correa Quintero',
  BRAHIAN_LOAIZA_HERNANDEZ: 'Brahian Loaiza Hernández',
  DAHIANA_GONZALEZ_RONDON: 'Dahiana González Rondón',
  DARLY_YADISA_ECHEVERRI_PATINO: 'Darly Yadisa Echeverri Patiño',
  DARWIN_GUZMAN_MENA: 'Darwin Guzmán Mena',
  ESTEBAN_ARBOLEDA_MORALES: 'Esteban Arboleda Morales',
  ESTEBAN_ORTIZ_LONDONO: 'Esteban Ortiz Londoño',
  FERMIN_ALEJANDRO_YEPES: 'Fermín Alejandro Yepes',
  JOSE_DANIEL_PUENTE_RODRIGUEZ: 'José Daniel Puente Rodríguez',
  JOSE_FELIPE_LOPEZ_MENDEZ: 'José Felipe López Méndez',
  JUAN_FELIPE_ZULUAGA_MEJIA: 'Juan Felipe Zuluaga Mejía',
  JUAN_SEBASTIAN_SANCHEZ_BLANDON: 'Juan Sebastián Sánchez Blandón',
  LEDYS_JOHANA_PALACIOS_MOYA: 'Ledys Johana Palacios Moya',
  LUIS_MIGUEL_CARDONA_RAMIREZ: 'Luis Miguel Cardona Ramírez',
  LUISA_FERNANDA_PICO_REYES: 'Luisa Fernanda Pico Reyes',
  LUZ_DANEY_HERNANDEZ_SEPULVEDA: 'Luz Daney Hernández Sepúlveda',
  MANUELA_GUTIERREZ_OSSA: 'Manuela Gutiérrez Ossa',
  MARIA_ALEXANDRA_CALLE_HENAO: 'María Alexandra Calle Henao',
  RAUL_BERNARDO_ACOSTA_ZAPATA: 'Raúl Bernardo Acosta Zapata',
  SANDRA_LILIANA_VALLE_VALLE: 'Sandra Liliana Valle Valle',
  SANDRA_PATRICA_MENDOZA_RINCON: 'Sandra Patricia Mendoza Rincón',
  SARA_VIVIANA_PARRA_BENITEZ: 'Sara Viviana Parra Benítez',
  SEBASTIAN_VALENCIA_BUSTAMANTE: 'Sebastián Valencia Bustamante',
  SINDY_KATERINE_ECHEVERRI_RAMIREZ: 'Sindy Katerine Echeverri Ramírez',
  SUSANA_DEL_MAR_RUIZ_GUALY: 'Susana del Mar Ruiz Gualy',
  VALENTINA_RODRIGUEZ_RAMIREZ: 'Valentina Rodríguez Ramírez',
  WILBER_ENRIQUE_PEREZ_TORRES: 'Wilber Enrique Pérez Torres',
  WILMAR_TUBERQUIA_AVENDANO: 'Wilmar Tuberquia Avendaño',
};

export const SENIORS = Object.entries(SENIOR_NAMES).map(([value, label]) => ({ value, label }));
