export interface Student {
  student_id: string;
  name: string;
  class: string;
  comprehension: number; // 0-100
  attention: number; // 0-100
  focus: number; // 0-100
  retention: number; // 0-100
  assessment_score: number; // 0-100
  engagement_time: number; // minutes per day
}

// Generate realistic student names
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Isabella', 'Elijah',
  'Sophia', 'William', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Mia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Mason',
  'Emily', 'Michael', 'Elizabeth', 'Ethan', 'Mila', 'Daniel', 'Ella',
  'Jacob', 'Avery', 'Logan', 'Sofia', 'Jackson', 'Camila', 'Levi',
  'Aria', 'Sebastian', 'Scarlett', 'Mateo', 'Victoria', 'Jack', 'Madison',
  'Owen', 'Luna', 'Theodore', 'Grace', 'Aiden', 'Chloe', 'Samuel',
  'Penelope', 'Joseph', 'Layla', 'John', 'Riley', 'David', 'Zoey',
  'Wyatt', 'Nora', 'Matthew', 'Lily', 'Luke', 'Eleanor', 'Asher',
  'Hannah', 'Carter', 'Lillian', 'Julian', 'Addison', 'Grayson', 'Aubrey',
  'Leo', 'Ellie', 'Jayden', 'Stella', 'Gabriel', 'Natalie', 'Isaac',
  'Zoe', 'Lincoln', 'Leah', 'Anthony', 'Hazel', 'Hudson', 'Violet',
  'Dylan', 'Aurora', 'Ezra', 'Savannah', 'Thomas', 'Audrey', 'Charles',
  'Brooklyn', 'Christopher', 'Bella', 'Jaxon', 'Claire', 'Maverick', 'Skylar'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
  'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
  'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos',
  'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez'
];

const classes = [
  'Computer Science A', 'Computer Science B', 'Mathematics A', 'Mathematics B',
  'Physics A', 'Physics B', 'Chemistry A', 'Chemistry B', 'Biology A', 'Biology B',
  'English Literature A', 'English Literature B', 'History A', 'History B',
  'Economics A', 'Economics B', 'Psychology A', 'Psychology B'
];

// Helper function to generate correlated random numbers
function generateCorrelatedValue(baseValue: number, correlation: number, variance: number = 15): number {
  const noise = (Math.random() - 0.5) * variance * 2;
  const correlatedValue = baseValue * correlation + noise + (Math.random() - 0.5) * (100 - baseValue * correlation);
  return Math.max(0, Math.min(100, correlatedValue));
}

// Generate normal distribution random number
function normalRandom(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

export function generateStudentData(count: number = 200): Student[] {
  const students: Student[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const studentClass = classes[Math.floor(Math.random() * classes.length)];
    
    // Generate base cognitive abilities with some correlation
    const baseAbility = Math.max(20, Math.min(95, normalRandom(65, 20)));
    
    // Generate correlated cognitive skills
    const comprehension = Math.max(10, Math.min(100, normalRandom(baseAbility, 12)));
    const attention = generateCorrelatedValue(comprehension, 0.7, 18);
    const focus = generateCorrelatedValue(attention, 0.8, 15);
    const retention = generateCorrelatedValue(comprehension, 0.75, 16);
    
    // Engagement time influenced by attention and interest
    const engagement_time_base = Math.max(30, Math.min(300, 
      attention * 1.5 + normalRandom(20, 25)
    ));
    
    // Assessment score influenced by all cognitive skills
    const cognitiveAverage = (comprehension + attention + focus + retention) / 4;
    const assessmentScore = Math.max(0, Math.min(100, 
      cognitiveAverage * 0.8 + normalRandom(0, 8) + 
      (engagement_time_base / 120) * 10 // Slight engagement influence
    ));
    
    const student: Student = {
      student_id: `STU${String(i + 1).padStart(4, '0')}`,
      name,
      class: studentClass,
      comprehension: Math.round(comprehension * 10) / 10,
      attention: Math.round(attention * 10) / 10,
      focus: Math.round(focus * 10) / 10,
      retention: Math.round(retention * 10) / 10,
      assessment_score: Math.round(assessmentScore * 10) / 10,
      engagement_time: Math.round(engagement_time_base)
    };
    
    students.push(student);
  }
  
  return students;
}

// Export the generated data
export const studentData = generateStudentData(200);

// Export as JSON for easy import
export const studentDataJSON = JSON.stringify(studentData, null, 2);