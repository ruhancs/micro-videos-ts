
export type FieldsErrors = {
    [field: string]: string[]
}

export default interface ValidateFieldsInterface<T> {
    errors: FieldsErrors
    validatedData: T
    validate(data: any): boolean;
}