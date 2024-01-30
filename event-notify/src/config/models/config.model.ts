export interface IConfigService {
  getString(name: string): string;
  getNumber(name: string): number;
  getBoolean(name: string): boolean;
  getDate(name: string): Date;
}

export interface ICreateAssessmentOptions {
  timeout: number;
  maxRedirects: number;
}

export interface IAssessmentOptions {
  createOptions: () => ICreateAssessmentOptions;
}
