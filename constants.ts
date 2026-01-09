import { ActivityLevelData } from './types';

export const ACTIVITY_LEVELS: ActivityLevelData[] = [
  {
    factor: 1.2,
    label: "Sedentary",
    description: "Little or no exercise, desk job"
  },
  {
    factor: 1.375,
    label: "Lightly Active",
    description: "Light exercise/sports 1-3 days/week"
  },
  {
    factor: 1.55,
    label: "Moderately Active",
    description: "Moderate exercise/sports 3-5 days/week"
  },
  {
    factor: 1.725,
    label: "Very Active",
    description: "Hard exercise/sports 6-7 days/week"
  },
  {
    factor: 1.9,
    label: "Extra Active",
    description: "Very hard exercise, physical job, or training 2x/day"
  }
];

export const COLOR_PALETTE = {
  dominant: "#EAE9E7",
  teal: "#285E65",
  green: "#7DA345",
  blue: "#96BDC4",
  red: "#AA463B",
  tan: "#C39B84"
};