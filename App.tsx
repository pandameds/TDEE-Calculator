import React, { useState } from 'react';
import { ActivityLevelData, CalculatorState, Gender, UnitSystem, CalculationResult } from './types';
import { ACTIVITY_LEVELS } from './constants';
import { Logo } from './components/Logo';
import { ResultsView } from './components/ResultsView';
import { ChevronDown, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    age: '',
    gender: Gender.Male,
    weight: '',
    heightCm: '',
    heightFt: '',
    heightIn: '',
    activityFactor: ACTIVITY_LEVELS[0].factor,
    unitSystem: UnitSystem.Metric,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleCalculate = () => {
    const errs: string[] = [];
    if (!state.age) errs.push('Age is required');
    if (!state.weight) errs.push('Weight is required');
    
    let heightInCm = 0;
    let weightInKg = 0;

    // Convert Height
    if (state.unitSystem === UnitSystem.Metric) {
      if (!state.heightCm) errs.push('Height is required');
      heightInCm = Number(state.heightCm);
    } else {
      if (!state.heightFt && state.heightFt !== 0) errs.push('Height (ft) is required');
      // Inches can be 0 or empty (assumed 0)
      const feet = Number(state.heightFt);
      const inches = Number(state.heightIn || 0);
      heightInCm = (feet * 30.48) + (inches * 2.54);
    }

    // Convert Weight
    if (state.unitSystem === UnitSystem.Metric) {
      weightInKg = Number(state.weight);
    } else {
      weightInKg = Number(state.weight) / 2.20462;
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);

    // Mifflin-St Jeor Equation
    // Male: (10 × kg) + (6.25 × cm) − (5 × age) + 5
    // Female: (10 × kg) + (6.25 × cm) − (5 × age) − 161
    let bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * Number(state.age));
    
    if (state.gender === Gender.Male) {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * state.activityFactor;

    setResult({
      bmr,
      tdee,
      targets: {
        cutAggressive: tdee * 0.80,
        cutModerate: tdee * 0.85,
        maintain: tdee,
        bulkLean: tdee * 1.05,
        bulkStrong: tdee * 1.15,
      }
    });
  };

  const handleInputChange = (field: keyof CalculatorState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-panda-base font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-panda-teal mb-2">TDEE Calculator</h1>
              <p className="text-gray-600">
                Calculate your Total Daily Energy Expenditure to understand how many calories you burn per day.
              </p>
            </div>

            {/* Unit Toggle */}
            <div className="bg-white p-1 rounded-lg border border-gray-200 inline-flex">
              <button
                onClick={() => handleInputChange('unitSystem', UnitSystem.Imperial)}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                  state.unitSystem === UnitSystem.Imperial
                    ? 'bg-panda-teal text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Imperial (ft/lb)
              </button>
              <button
                onClick={() => handleInputChange('unitSystem', UnitSystem.Metric)}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                  state.unitSystem === UnitSystem.Metric
                    ? 'bg-panda-teal text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Metric (cm/kg)
              </button>
            </div>

            <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-white">
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('gender', Gender.Male)}
                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      state.gender === Gender.Male
                        ? 'border-panda-teal bg-panda-teal/5 text-panda-teal'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => handleInputChange('gender', Gender.Female)}
                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      state.gender === Gender.Female
                        ? 'border-panda-teal bg-panda-teal/5 text-panda-teal'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="relative">
                  <input
                    type="number"
                    value={state.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                    placeholder="25"
                  />
                  <span className="absolute right-4 top-4 text-gray-400 text-sm">years</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                {state.unitSystem === UnitSystem.Metric ? (
                  <div className="relative">
                    <input
                      type="number"
                      value={state.heightCm}
                      onChange={(e) => handleInputChange('heightCm', e.target.value)}
                      className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                      placeholder="175"
                    />
                    <span className="absolute right-4 top-4 text-gray-400 text-sm">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={state.heightFt}
                        onChange={(e) => handleInputChange('heightFt', e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                        placeholder="5"
                      />
                      <span className="absolute right-4 top-4 text-gray-400 text-sm">ft</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={state.heightIn}
                        onChange={(e) => handleInputChange('heightIn', e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                        placeholder="9"
                      />
                      <span className="absolute right-4 top-4 text-gray-400 text-sm">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    value={state.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                    placeholder={state.unitSystem === UnitSystem.Metric ? "70" : "155"}
                  />
                  <span className="absolute right-4 top-4 text-gray-400 text-sm">
                    {state.unitSystem === UnitSystem.Metric ? 'kg' : 'lbs'}
                  </span>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <div className="relative">
                  <div className="absolute right-4 top-4 pointer-events-none text-gray-500">
                    <ChevronDown size={20} />
                  </div>
                  <select
                    value={state.activityFactor}
                    onChange={(e) => handleInputChange('activityFactor', Number(e.target.value))}
                    className="block w-full appearance-none rounded-xl border-gray-200 bg-gray-50 p-4 pr-10 text-gray-900 focus:border-panda-teal focus:ring-panda-teal sm:text-sm transition-shadow outline-none border focus:ring-2"
                  >
                    {ACTIVITY_LEVELS.map((level) => (
                      <option key={level.factor} value={level.factor}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dynamic description of selected activity */}
                <p className="mt-2 text-sm text-panda-teal/80">
                  {ACTIVITY_LEVELS.find(l => l.factor === state.activityFactor)?.description}
                </p>
              </div>

              {/* Error Message */}
              {errors.length > 0 && (
                <div className="bg-red-50 text-panda-red p-4 rounded-lg text-sm">
                  <p className="font-bold">Please correct the following:</p>
                  <ul className="list-disc ml-5">
                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className="w-full bg-panda-teal text-white py-4 rounded-xl font-bold text-lg hover:bg-panda-teal/90 transition-all shadow-lg shadow-panda-teal/20 flex items-center justify-center gap-2 group"
              >
                Calculate Results
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-7">
             <div className="lg:sticky lg:top-24">
                <ResultsView results={result} onRecalculate={() => setResult(null)} />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;