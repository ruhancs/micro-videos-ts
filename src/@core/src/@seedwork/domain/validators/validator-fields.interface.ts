
export type FieldsErrors = {
    [field: string]: string[]
}

export interface ValidateFieldsInterface<T> {
    errors: FieldsErrors
    validatedData: T
    validate(data: any): boolean;
}

export default ValidateFieldsInterface