export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum UnitSystem {
  Metric = 'metric',
  Imperial = 'imperial',
}

export interface ActivityLevelData {
  factor: number;
  label: string;
  description: string;
}

export interface CalculatorState {
  age: number | '';
  gender: Gender;
  weight: number | '';
  heightCm: number | '';
  heightFt: number | '';
  heightIn: number | '';
  activityFactor: number;
  unitSystem: UnitSystem;
}

export interface CalculationResult {
  bmr: number;
  tdee: number;
  targets: {
    cutAggressive: number;
    cutModerate: number;
    maintain: number;
    bulkLean: number;
    bulkStrong: number;
  };
}