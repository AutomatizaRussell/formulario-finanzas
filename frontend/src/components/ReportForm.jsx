import { ALL_FIELDS, FILE_FIELD, SECTIONS, SUPPORT_SECTION } from '../config/formSchema.js';
import { STATUS, useReportForm } from '../hooks/useReportForm.js';
import Alert from './feedback/Alert.jsx';
import SuccessPanel from './feedback/SuccessPanel.jsx';
import Field from './form/Field.jsx';
import FileDropzone from './form/FileDropzone.jsx';
import FormSection, { FieldGroup } from './form/FormSection.jsx';
import ProgressBar from './form/ProgressBar.jsx';
import { SpinnerIcon } from './icons/Icons.jsx';
import './ReportForm.css';

const SUBMIT_LABELS = {
  [STATUS.IDLE]: 'Finalizar y enviar reporte',
  [STATUS.SENDING]: 'Enviando reporte…',
  [STATUS.ERROR]: 'Reintentar envío',
};

const FIELD_ORDER =[...ALL_FIELDS.map((field) => field.name), FILE_FIELD.name];

function focusFirstError(errors) {
  const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
  const element = firstInvalid && document.getElementById(`field-${firstInvalid}`);
  if (!element) return;
  element.closest('.field, .file-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.focus({ preventScroll: true });
}

export default function ReportForm() {
  const form = useReportForm();
  const isSending = form.status === STATUS.SENDING;
  const errorCount = Object.keys(form.errors).length;

  if (form.status === STATUS.SUCCESS) {
    return <SuccessPanel onReset={form.reset} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = await form.submit();
    focusFirstError(errors);
  };

  return (
    <form className="report-form" onSubmit={handleSubmit} noValidate>
      <div className="report-form__progress">
        <ProgressBar {...form.progress} />
      </div>

      {SECTIONS.map((section, index) => (
        <FormSection
          key={section.id}
          number={index + 1}
          title={section.title}
          description={section.description}
        >
          {section.groups.map((group, groupIndex) => (
            <FieldGroup key={groupIndex} {...group}>
              {group.fields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={form.values[field.name]}
                  error={form.errors[field.name]}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
              ))}
            </FieldGroup>
          ))}
        </FormSection>
      ))}

      <FormSection
        number={SECTIONS.length + 1}
        title={SUPPORT_SECTION.title}
        description={SUPPORT_SECTION.description}
      >
        <FileDropzone
          field={FILE_FIELD}
          files={form.files}
          error={form.errors[FILE_FIELD.name]}
          onAdd={form.addFiles}
          onRemove={form.removeFile}
        />
      </FormSection>

      <div className="report-form__actions">
        {form.status === STATUS.ERROR && (
          <Alert title="No pudimos enviar el reporte. Intente de nuevo.">{form.submitError}</Alert>
        )}
        {errorCount > 0 && (
          <p className="report-form__pending" role="status">
            Hay {errorCount} {errorCount === 1 ? 'campo pendiente' : 'campos pendientes'} por
            revisar.
          </p>
        )}
        <button type="submit" className="button button--primary button--block" disabled={isSending}>
          {isSending && <SpinnerIcon />}
          {SUBMIT_LABELS[form.status] ?? SUBMIT_LABELS[STATUS.IDLE]}
        </button>
        <p className="report-form__note">
          Los campos marcados con <span className="field__required">*</span> son obligatorios.
        </p>
      </div>
    </form>
  );
}
