export type Subject = "Physics" | "Chemistry" | "Biology"

export type SyllabusChapter = {
  id: string
  unit: number
  name: string
  classLevel?: "Class 11" | "Class 12" | "Both"
}

export const physicsSyllabus: SyllabusChapter[] = [
  {
    id: "physics-1",
    unit: 1,
    name: "Physics and Measurement",
    classLevel: "Class 11",
  },
  {
    id: "physics-2",
    unit: 2,
    name: "Kinematics",
    classLevel: "Class 11",
  },
  {
    id: "physics-3",
    unit: 3,
    name: "Laws of Motion",
    classLevel: "Class 11",
  },
  {
    id: "physics-4",
    unit: 4,
    name: "Work, Energy and Power",
    classLevel: "Class 11",
  },
  {
    id: "physics-5",
    unit: 5,
    name: "Rotational Motion",
    classLevel: "Class 11",
  },
  {
    id: "physics-6",
    unit: 6,
    name: "Gravitation",
    classLevel: "Class 11",
  },
  {
    id: "physics-7",
    unit: 7,
    name: "Properties of Solids and Liquids",
    classLevel: "Class 11",
  },
  {
    id: "physics-8",
    unit: 8,
    name: "Thermodynamics",
    classLevel: "Class 11",
  },
  {
    id: "physics-9",
    unit: 9,
    name: "Kinetic Theory of Gases",
    classLevel: "Class 11",
  },
  {
    id: "physics-10",
    unit: 10,
    name: "Oscillations and Waves",
    classLevel: "Class 11",
  },
  {
    id: "physics-11",
    unit: 11,
    name: "Electrostatics",
    classLevel: "Class 12",
  },
  {
    id: "physics-12",
    unit: 12,
    name: "Current Electricity",
    classLevel: "Class 12",
  },
  {
    id: "physics-13",
    unit: 13,
    name: "Magnetic Effects of Current and Magnetism",
    classLevel: "Class 12",
  },
  {
    id: "physics-14",
    unit: 14,
    name: "Electromagnetic Induction and Alternating Currents",
    classLevel: "Class 12",
  },
  {
    id: "physics-15",
    unit: 15,
    name: "Electromagnetic Waves",
    classLevel: "Class 12",
  },
  {
    id: "physics-16",
    unit: 16,
    name: "Optics",
    classLevel: "Class 12",
  },
  {
    id: "physics-17",
    unit: 17,
    name: "Dual Nature of Matter and Radiation",
    classLevel: "Class 12",
  },
  {
    id: "physics-18",
    unit: 18,
    name: "Atoms and Nuclei",
    classLevel: "Class 12",
  },
  {
    id: "physics-19",
    unit: 19,
    name: "Electronic Devices",
    classLevel: "Class 12",
  },
  {
    id: "physics-20",
    unit: 20,
    name: "Experimental Skills",
    classLevel: "Both",
  },
]

export const chemistrySyllabus: SyllabusChapter[] = [
  {
    id: "chemistry-1",
    unit: 1,
    name: "Some Basic Concepts of Chemistry",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-2",
    unit: 2,
    name: "Atomic Structure",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-3",
    unit: 3,
    name: "Chemical Bonding and Molecular Structure",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-4",
    unit: 4,
    name: "Chemical Thermodynamics",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-5",
    unit: 5,
    name: "Solutions",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-6",
    unit: 6,
    name: "Equilibrium",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-7",
    unit: 7,
    name: "Redox Reactions and Electrochemistry",
    classLevel: "Both",
  },
  {
    id: "chemistry-8",
    unit: 8,
    name: "Chemical Kinetics",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-9",
    unit: 9,
    name: "Classification of Elements and Periodicity in Properties",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-10",
    unit: 10,
    name: "p-Block Elements",
    classLevel: "Both",
  },
  {
    id: "chemistry-11",
    unit: 11,
    name: "d- and f-Block Elements",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-12",
    unit: 12,
    name: "Coordination Compounds",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-13",
    unit: 13,
    name: "Purification and Characterisation of Organic Compounds",
    classLevel: "Both",
  },
  {
    id: "chemistry-14",
    unit: 14,
    name: "Some Basic Principles of Organic Chemistry",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-15",
    unit: 15,
    name: "Hydrocarbons",
    classLevel: "Class 11",
  },
  {
    id: "chemistry-16",
    unit: 16,
    name: "Organic Compounds Containing Halogens",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-17",
    unit: 17,
    name: "Organic Compounds Containing Oxygen",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-18",
    unit: 18,
    name: "Organic Compounds Containing Nitrogen",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-19",
    unit: 19,
    name: "Biomolecules",
    classLevel: "Class 12",
  },
  {
    id: "chemistry-20",
    unit: 20,
    name: "Principles Related to Practical Chemistry",
    classLevel: "Both",
  },
]

export const biologySyllabus: SyllabusChapter[] = [
  {
    id: "biology-1",
    unit: 1,
    name: "Diversity in Living World",
    classLevel: "Class 11",
  },
  {
    id: "biology-2",
    unit: 2,
    name: "Structural Organisation in Animals and Plants",
    classLevel: "Class 11",
  },
  {
    id: "biology-3",
    unit: 3,
    name: "Cell Structure and Function",
    classLevel: "Class 11",
  },
  {
    id: "biology-4",
    unit: 4,
    name: "Plant Physiology",
    classLevel: "Class 11",
  },
  {
    id: "biology-5",
    unit: 5,
    name: "Human Physiology",
    classLevel: "Class 11",
  },
  {
    id: "biology-6",
    unit: 6,
    name: "Reproduction",
    classLevel: "Class 12",
  },
  {
    id: "biology-7",
    unit: 7,
    name: "Genetics and Evolution",
    classLevel: "Class 12",
  },
  {
    id: "biology-8",
    unit: 8,
    name: "Biology and Human Welfare",
    classLevel: "Class 12",
  },
  {
    id: "biology-9",
    unit: 9,
    name: "Biotechnology and Its Applications",
    classLevel: "Class 12",
  },
  {
    id: "biology-10",
    unit: 10,
    name: "Ecology and Environment",
    classLevel: "Class 12",
  },
]

export const syllabusBySubject = {
  Physics: physicsSyllabus,
  Chemistry: chemistrySyllabus,
  Biology: biologySyllabus,
}